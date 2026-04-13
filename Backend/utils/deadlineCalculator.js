const d={Low:14,Medium:7,High:3,Urgent:1};module.exports={calculateDeadline:(p)=>{const x=new Date();x.setDate(x.getDate()+(d[p]||7));return x;}};
