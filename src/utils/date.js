
//时间戳转换
export function dateFilter(time) {    
  if (!time) {       
    return ''    
  } else {        
    const date = new Date(time)  
    const dateNumFun = (num) => num < 10 ? `0${num}` : num 
    const [Y, M, D, h, m, s] = [            
        date.getFullYear(),            
        dateNumFun(date.getMonth() + 1),            
        dateNumFun(date.getDate()),            
        dateNumFun(date.getHours()),            
        dateNumFun(date.getMinutes()),            
        dateNumFun(date.getSeconds())        
    ]        
    return `${Y}-${M}-${D} ${h}:${m}:${s}` 
  }
}
//导出方法
export default { dateFilter }