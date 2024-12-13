import { message } from 'ant-design-vue'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import type { Field } from '@/views/design/model/types'

export interface UseFieldImportExportOptions {
  onUpdate: (fields: Field[]) => void
}

export function useFieldImportExport(fields: Field[], options: UseFieldImportExportOptions) {
  const exportFields = () => {
    try {
      const exportData = fields.map(field => ({
        '字段名': field.name,
        '数据类型': field.dataType,
        '长度/精度': field.length,
        '可空': field.nullable ? '是' : '否',
        '主键': field.primaryKey ? '是' : '否',
        '自增': field.autoIncrement ? '是' : '否',
        '默认值': field.defaultValue || '',
        '备注': field.comment || ''
      }))

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Fields')
      
      // 设置列宽
      const colWidths = [
        { wch: 15 }, // 字段名
        { wch: 12 }, // 数据类型
        { wch: 10 }, // 长度/精度
        { wch: 6 },  // 可空
        { wch: 6 },  // 主键
        { wch: 6 },  // 自增
        { wch: 15 }, // 默认值
        { wch: 20 }  // 备注
      ]
      ws['!cols'] = colWidths

      // 生成并下载文件
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      saveAs(data, `table_fields_${Date.now()}.xlsx`)
      message.success('导出成功')
    } catch (error) {
      console.error('导出失败:', error)
      message.error('导出失败')
    }
  }

  const importFields = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls'
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          const reader = new FileReader()
          reader.onload = (e) => {
            try {
              const data = new Uint8Array(e.target?.result as ArrayBuffer)
              const workbook = XLSX.read(data, { type: 'array' })
              const worksheet = workbook.Sheets[workbook.SheetNames[0]]
              const jsonData = XLSX.utils.sheet_to_json(worksheet)
              
              const newFields: Field[] = jsonData.map((row: any) => ({
                id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: row['字段名'] || '',
                displayName: row['字段名'] || '',
                dataType: row['数据类型'] || '',
                length: row['长度/精度'] ? Number(row['长度/精度']) : 0,
                precision: 0,
                nullable: row['可空'] === '是',
                primaryKey: row['主键'] === '是',
                autoIncrement: row['自增'] === '是',
                defaultValue: row['默认值'] || '',
                comment: row['备注'] || ''
              }))

              // 验证导入的字段
              const invalidFields = newFields.filter(field => !field.name || !field.dataType)
              if (invalidFields.length > 0) {
                message.error('导入的数据格式不正确，请检查字段名和数据类型是否完整')
                return
              }

              options.onUpdate([...fields, ...newFields])
              message.success(`成功导入 ${newFields.length} 个字段`)
            } catch (error) {
              console.error('解析Excel失败:', error)
              message.error('解析Excel失败，请检查文件格式')
            }
          }
          reader.readAsArrayBuffer(file)
        } catch (error) {
          console.error('导入失败:', error)
          message.error('导入失败')
        }
      }
    }
    input.click()
  }

  return {
    exportFields,
    importFields
  }
} 