&lt;template&gt;
  &lt;div class=&quot;template-skeleton&quot;&gt;
    &lt;!-- 搜索框骨架 --&gt;
    &lt;div class=&quot;search-skeleton&quot;&gt;
      &lt;div class=&quot;search-input&quot;&gt;
        &lt;div class=&quot;prefix-icon skeleton-animate&quot;&gt;&lt;/div&gt;
        &lt;div class=&quot;input-block skeleton-animate&quot;&gt;&lt;/div&gt;
        &lt;div class=&quot;suffix-icon skeleton-animate&quot;&gt;&lt;/div&gt;
      &lt;/div&gt;
      &lt;div class=&quot;action-btn skeleton-animate&quot;&gt;&lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- 历史记录骨架 --&gt;
    &lt;div class=&quot;history-skeleton&quot;&gt;
      &lt;div class=&quot;history-header&quot;&gt;
        &lt;div class=&quot;title skeleton-animate&quot;&gt;&lt;/div&gt;
        &lt;div class=&quot;action skeleton-animate&quot;&gt;&lt;/div&gt;
      &lt;/div&gt;
      &lt;div class=&quot;history-list&quot;&gt;
        &lt;div 
          v-for=&quot;i in 5&quot; 
          :key=&quot;i&quot;
          class=&quot;history-item&quot;
          :style=&quot;{ animationDelay: `${i * 0.1}s` }&quot;
        &gt;
          &lt;div class=&quot;item-icon skeleton-animate&quot;&gt;&lt;/div&gt;
          &lt;div class=&quot;item-content&quot;&gt;
            &lt;div class=&quot;item-title skeleton-animate&quot;&gt;&lt;/div&gt;
            &lt;div class=&quot;item-subtitle skeleton-animate&quot;&gt;&lt;/div&gt;
          &lt;/div&gt;
          &lt;div class=&quot;item-action skeleton-animate&quot;&gt;&lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- 分组骨架 --&gt;
    &lt;div class=&quot;group-skeleton&quot;&gt;
      &lt;div class=&quot;group-header&quot;&gt;
        &lt;div class=&quot;title skeleton-animate&quot;&gt;&lt;/div&gt;
        &lt;div class=&quot;tabs&quot;&gt;
          &lt;div 
            v-for=&quot;i in 3&quot; 
            :key=&quot;i&quot;
            class=&quot;tab skeleton-animate&quot;
            :style=&quot;{ animationDelay: `${i * 0.1}s` }&quot;
          &gt;&lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;div class=&quot;group-grid&quot;&gt;
        &lt;div 
          v-for=&quot;i in 6&quot; 
          :key=&quot;i&quot;
          class=&quot;grid-item skeleton-animate&quot;
          :style=&quot;{ animationDelay: `${i * 0.1}s` }&quot;
        &gt;&lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang=&quot;ts&quot;&gt;
// 骨架屏组件
&lt;/script&gt;

&lt;style lang=&quot;less&quot; scoped&gt;
.template-skeleton {
  width: 100%;
  padding: 16px;

  .skeleton-animate {
    position: relative;
    background: #f5f5f5;
    overflow: hidden;

    &::after {
      content: &quot;&quot;;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      animation: skeleton-loading 1.5s infinite;
    }
  }

  .search-skeleton {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;

    .search-input {
      flex: 1;
      height: 32px;
      display: flex;
      align-items: center;
      background: #fafafa;
      border-radius: 4px;
      padding: 0 8px;

      .prefix-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
      }

      .input-block {
        flex: 1;
        height: 16px;
        margin: 0 12px;
        border-radius: 2px;
      }

      .suffix-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
      }
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
  }

  .history-skeleton {
    margin-bottom: 24px;

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .title {
        width: 80px;
        height: 20px;
        border-radius: 2px;
      }

      .action {
        width: 48px;
        height: 20px;
        border-radius: 2px;
      }
    }

    .history-list {
      .history-item {
        display: flex;
        align-items: center;
        padding: 12px;
        gap: 12px;
        border-radius: 4px;
        margin-bottom: 8px;
        background: #fafafa;

        .item-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .item-content {
          flex: 1;

          .item-title {
            width: 60%;
            height: 16px;
            border-radius: 2px;
            margin-bottom: 8px;
          }

          .item-subtitle {
            width: 40%;
            height: 12px;
            border-radius: 2px;
          }
        }

        .item-action {
          width: 16px;
          height: 16px;
          border-radius: 2px;
        }
      }
    }
  }

  .group-skeleton {
    .group-header {
      margin-bottom: 24px;

      .title {
        width: 120px;
        height: 24px;
        border-radius: 2px;
        margin-bottom: 16px;
      }

      .tabs {
        display: flex;
        gap: 16px;

        .tab {
          width: 80px;
          height: 32px;
          border-radius: 16px;
        }
      }
    }

    .group-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;

      .grid-item {
        height: 120px;
        border-radius: 8px;
        background: #fafafa;
      }
    }
  }
}

@keyframes skeleton-loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
&lt;/style&gt;
