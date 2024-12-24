interface ResponseStats {
  status: {
    code: number;
    text: string;
    category: 'success' | 'redirect' | 'clientError' | 'serverError';
  };
  timing: {
    total: number;
    dns?: number;
    tcp?: number;
    tls?: number;
    request: number;
    response: number;
  };
  size: {
    total: number;
    headers: number;
    body: number;
  };
  headers: {
    count: number;
    securityHeaders: string[];
    cacheControl?: string;
    contentType?: string;
    server?: string;
  };
}

export const responseAnalyzer = {
  // 分析响应状态
  analyzeStatus: (status: number, statusText: string) => {
    let category: 'success' | 'redirect' | 'clientError' | 'serverError';
    
    if (status >= 200 && status < 300) {
      category = 'success';
    } else if (status >= 300 && status < 400) {
      category = 'redirect';
    } else if (status >= 400 && status < 500) {
      category = 'clientError';
    } else {
      category = 'serverError';
    }

    return {
      code: status,
      text: statusText,
      category,
    };
  },

  // 分析响应时间
  analyzeTiming: (duration: number, performance?: PerformanceResourceTiming) => {
    const timing: ResponseStats['timing'] = {
      total: duration,
      request: 0,
      response: 0,
    };

    if (performance) {
      timing.dns = performance.domainLookupEnd - performance.domainLookupStart;
      timing.tcp = performance.connectEnd - performance.connectStart;
      if (performance.secureConnectionStart > 0) {
        timing.tls = performance.connectEnd - performance.secureConnectionStart;
      }
      timing.request = performance.responseStart - performance.requestStart;
      timing.response = performance.responseEnd - performance.responseStart;
    } else {
      // 如果没有详细的性能数据，简单估算请求和响应时间
      timing.request = duration * 0.3;
      timing.response = duration * 0.7;
    }

    return timing;
  },

  // 分析响应大小
  analyzeSize: (headers: Record<string, string>, body: string) => {
    const headerSize = Object.entries(headers)
      .reduce((size, [key, value]) => size + key.length + value.length + 4, 0);

    return {
      total: headerSize + body.length,
      headers: headerSize,
      body: body.length,
    };
  },

  // 分析响应头
  analyzeHeaders: (headers: Record<string, string>) => {
    const securityHeaders = [
      'strict-transport-security',
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'referrer-policy',
    ].filter(header => headers[header.toLowerCase()]);

    return {
      count: Object.keys(headers).length,
      securityHeaders,
      cacheControl: headers['cache-control'],
      contentType: headers['content-type'],
      server: headers['server'],
    };
  },

  // 生成完整的响应统计信息
  generateStats: (
    status: number,
    statusText: string,
    headers: Record<string, string>,
    body: string,
    duration: number,
    performance?: PerformanceResourceTiming
  ): ResponseStats => {
    return {
      status: responseAnalyzer.analyzeStatus(status, statusText),
      timing: responseAnalyzer.analyzeTiming(duration, performance),
      size: responseAnalyzer.analyzeSize(headers, body),
      headers: responseAnalyzer.analyzeHeaders(headers),
    };
  },

  // 分析响应数据的复杂度
  analyzeComplexity: (data: any): { depth: number; breadth: number; leafNodes: number } => {
    let maxDepth = 0;
    let maxBreadth = 0;
    let leafNodes = 0;

    const analyze = (obj: any, depth: number = 0) => {
      if (depth > maxDepth) maxDepth = depth;

      if (typeof obj === 'object' && obj !== null) {
        const keys = Object.keys(obj);
        if (keys.length > maxBreadth) maxBreadth = keys.length;

        if (Array.isArray(obj)) {
          if (obj.length === 0) leafNodes++;
          obj.forEach(item => analyze(item, depth + 1));
        } else {
          if (keys.length === 0) leafNodes++;
          keys.forEach(key => analyze(obj[key], depth + 1));
        }
      } else {
        leafNodes++;
      }
    };

    analyze(data);
    return { depth: maxDepth, breadth: maxBreadth, leafNodes };
  },
}; 