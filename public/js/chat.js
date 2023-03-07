const authorSchema = new normalizr.schema.Entity('authors');
const messagesSchema = new normalizr.schema.Entity('messages', {
    author: authorSchema
});
const chatSchema = new normalizr.schema.Entity('chat', {
    messages: [messagesSchema]
});

const socket = io();
console.log("empezamos");
const catalogoElement = document.querySelector('#catalogo');
const chatElement = document.querySelector('#chat');

function addMessage(e) {
    if(document.querySelector('#email').value){
        const fecha = new Date();

        const mensaje = {
            author: {
                id: document.querySelector('#email').value,
                name: document.querySelector('#name').value,
                lastname: document.querySelector('#lastname').value,
                age: document.querySelector('#age').value,
                alias: document.querySelector('#alias').value,
                avatar: document.querySelector('#avatar').value,
            },
            text: document.querySelector('#text').value,
            date: fecha.toLocaleString()
        }
        socket.emit('addMessage', mensaje);
    }
    return false;
}

const renderMessages = messages => {
    const html = messages.messages.map((message, index) => {
        return(
            `
            <div class="list-group-item list-group-item-action d-flex gap-3 py-3">
                <img src="${message.author.avatar}" alt="${message.author.alias}" width="32" height="32" class="rounded-circle flex-shrink-0">
                <div class="d-flex gap-2 w-100 justify-content-between">
                    <div>
                        <h6 class="mb-0">${message.author.id} &bull; <span class="text-info">${message.author.alias}<span></h6>
                        <p class="mb-0 opacity-75">${message.text}</p>
                    </div>
                    <small class="opacity-50 text-nowrap">${message.date}</small>
                </div>
            </div>
            `
        )
    }).join(" ");
    chatElement.innerHTML = html;
}


function addProduct(e) {
    const producto = {
        title: document.querySelector('#title').value,
        price: document.querySelector('#price').value,
        thumbnail: document.querySelector('#thumbnail').value
    };
    socket.emit('addProduct', producto);
    return false;
}

const renderProducts = products => {
    const html = products.map((product, index) => {
        return(
            `
            <tr class="align-middle">
                <td class="">${product.title}</td>
                <td class="text-end">${product.price}</td>
                <td class="text-center"><img src="${product.thumbnail}" alt="${product.title}"></td>
            </tr>
            `
        )
    }).join(" ");
    catalogoElement.innerHTML = html;
}

socket.on('products', products => {
    renderProducts(products);
});

socket.on('messages', messages => {
    const normLength = JSON.stringify(messages).length;
    const denorm = normalizr.denormalize(messages.result, chatSchema, messages.entities);
    const denormLength = JSON.stringify(denorm).length;

    console.log(`De ${normLength} a ${denormLength}: ${(100 - ((normLength / denormLength )*100)).toFixed(2)}% de cambio`);

    renderMessages(denorm);
});