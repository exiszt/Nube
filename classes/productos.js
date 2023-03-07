const {faker} = require('@faker-js/faker')
faker.locale = 'es'

class Productos {
    constructor(){
        this.contador = 0;
        this.catalogo = [];
    }

    populateProductos(number = 5){
        for (let i = 0; i < number; i++) {
            const np = this.generateRandomProducto()
            this.addProducto(np);
        }
        return
    }

    generateRandomProducto(){
        const newProduct = {
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnail: faker.image.abstract(100, 100)
        }
        return newProduct;
    }

    getProductos(){
        return this.catalogo;
    }

    getProducto(id){
        return this.catalogo.find(p => p.id === parseInt(id));
    }

    deleteProducto(id){
        const newCatalogo = this.catalogo.filter(p =>  p.id != parseInt(id));
        const found = newCatalogo.length != this.catalogo.length;
        
        if(found){
            this.catalogo = newCatalogo;
        }

        return found;
    }

    addProducto(newProduct){
        this.contador = this.contador + 1;
        this.catalogo.push({
            id: this.contador,
            title: newProduct.title, 
            price: newProduct.price, 
            thumbnail: newProduct.thumbnail
        });
        return this.catalogo[this.catalogo.length - 1];
    }

    updateProducto(id, data){
        let found = 0;
        const newCatalogo = this.catalogo.map(p => {
            if(p.id === parseInt(id)){
                found = 1;
                const {title, price, thumbnail} = data;
                return {...p, title, price, thumbnail};
            }else{
                return p;
            }
        })

        this.catalogo = newCatalogo;

        return found;
    }

}

module.exports = Productos;