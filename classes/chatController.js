const fs = require('fs');
const normalizr = require('normalizr');
const logger = require('../utils/logger');

class ChatController {
    constructor(fileName){
        this.fileName = fileName;
        this.authorSchema = new normalizr.schema.Entity('authors');
        this.messagesSchema = new normalizr.schema.Entity('messages', {
            author: this.authorSchema
        });
        this.chatSchema = new normalizr.schema.Entity('chat', {
            messages: [this.messagesSchema]
        });
    }

    async readFile(){
        return fs.promises.readFile(this.fileName, 'utf-8');
    }

    async getAllDenormalized(){
        try {
            const data = await this.readFile();
            return JSON.parse(data);
        } catch (error) {
            logger.error(`Error: ${error}`);
            console.log(error);
        }
    }

    async getAll(){
        try {
            const data = await this.readFile();
            return normalizr.normalize(JSON.parse(data), this.chatSchema);
        } catch (error) {
            logger.error(`Error: ${error}`);
            console.log(error);
        }
    }

    async addMessage(message){
        try {
            const data = await this.getAllDenormalized();
            message.id = data.messages.length + 1;
            data.messages.push(message);
            await fs.promises.writeFile(this.fileName, JSON.stringify(data));
            return normalizr.normalize(data, this.chatSchema);
        } catch (error) {
            logger.error(`Error: ${error}`);
            console.log(error);
        }
    }
}

module.exports = ChatController;