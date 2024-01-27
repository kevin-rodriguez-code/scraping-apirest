const axios = require("axios")
const cheerio= require("cheerio")
const express = require("express")
const app = express()
const fs= require("fs")



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const url = 'https://elpais.com/ultimas-noticias'

let noticias = []


app.get('/', async(req, res) => {
    try{
        const response = await axios.get(url)
        const html = response.data
        const $ = cheerio.load(html)
        
        const titulos =[]
        $('.c_h h2').each((index, element ) => {
            const titulo = $(element).text()
            titulos.push(titulo)})
            
            const images = []
            
            $('.b-st_a img').each((_, element) => {
                const img = $(element).attr('src')
                images.push(img)
                
            })
            
            const descriptionsArray = [];
            $('.b-st_a .c_d').each((index, element) => {
                const description = $(element).text()
                descriptionsArray.push(description)
            })
            
            const linksArray = [];
            $('.b-st_a a').each((index, element)=> {
                const link = $(element).attr("href");
                linksArray.push(link);
            })
            
            noticias.push({
                titulo: titulos,
                imagen: images,
                descripcion: descriptionsArray,
                enlace: linksArray,
            });
            
            console.log(noticias)
        

            function guardarDatos() {
                fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
              }
        
            guardarDatos()
       
        } catch(error){
            console.error(error)
        }
    })
    
    
    
    
    
    
    app.listen(3001, ()=>{
        console.log('El servidor está escuchando en el puerto http://localhost:3001')
    })
    