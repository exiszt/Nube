const fs = require('fs');

class Container{
    constructor(fileName){
        this.fileName = fileName;
    }

    async readFile(){
        return fs.promises.readFile(this.fileName, 'utf-8');
    }

    async getAll(){
        try {
            const data = await this.readFile();
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAll(){
        try {
            await fs.promises.writeFile(this.fileName, "[]");
            return 
        } catch (error) {
            console.log(error);
        }
    }

    async save(product){
        try {
            const data = await this.getAll();
            product.id = this.createId(data);

            data.push(product);
            await fs.promises.writeFile(this.fileName, JSON.stringify(data));

            return product.id;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id){
        try {
            const data = await this.getAll();
            const result = data.find((product) => product.id === id );

            return result ? result : null;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id){
        try {
            const data = await this.getAll();
            const result = data.filter((product) => product.id !== id );

            await fs.promises.writeFile(this.fileName, JSON.stringify(result));
            return
        } catch (error) {
            console.log(error);
        }
    }

    createId(data){
        const lastProduct = data.length ? data[data.length-1] : {id: 0};
        return lastProduct.id + 1;
    }
}

module.exports = Contenedor;