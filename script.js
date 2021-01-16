const web3 = new Web3(window.web3.currentProvider);


window.addEventListener('load', async()=>{

    window.web3.currentProvider.enable();

    const abi = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "todo",
                    "type": "string"
                }
            ],
            "name": "addTodo",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "TodoAdded",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "getUserTodos",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "todos",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const contractAddress = '0xC45c29E2608B5d91Faa4B6F6E4067E849aAf2B0b';

    const fromAddress = await web3.eth.getAccounts();

    const instance = new web3.eth.Contract(abi, contractAddress, { from:fromAddress[0] });


    instance.events.TodoAdded()
    .on('data', (event)=>{
        const returned = event.returnValues;

        console.log(returned);

        const todo = returned['1'];

        const li = document.createElement('li');
        li.classList.add("list-group-item");
        li.innerHTML = todo;
        document.getElementById('todos').appendChild(li);
        console.log(todo);
    })
    .on('error', (error, receipt)=>{ 
        // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log(error);
    });

    await renderTodos(fromAddress[0], instance);

    const btn = document.getElementById("addTodo");
    const input = document.getElementById("todo");

    btn.addEventListener('click', ()=>{
        addTodo(input.value, instance, fromAddress[0]);
    })
})

const addTodo = (todo, instance, user)=>{
    instance.methods.addTodo(todo).send({ from:user });
}

const retrieveTodo = async (user, instance)=>{
    return await instance.methods.getUserTodos(user).call({ from:user });
}

const renderTodos = async (from, instance)=>{
    const todos = await retrieveTodo(from, instance);
    todos.map(el=>{
        const li = document.createElement('li');
        li.classList.add("list-group-item");
        li.innerHTML = el;
        document.getElementById('todos').appendChild(li);
    });
}
