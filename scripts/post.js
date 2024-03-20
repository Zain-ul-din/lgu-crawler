const url = process.argv[2];

if(url === undefined) throw new Error('Url not Specified')

fetch(url, {  method: 'post'  }).then(res => res.text())
.then(res=> console.log(res))

