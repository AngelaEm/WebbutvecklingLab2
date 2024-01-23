
// Array with products
const products = [];
addProductsToArray();

// Get all products and add products to array 
function addProductsToArray(){
    getAllProducts().then(data => {
        products.push(...data); 
        console.log(products); 
        }).catch(error => {
            console.error("Det gick inte att hämta produkterna:", error);
    });
}

// Get products from database
function getAllProducts(){
    return fetch("http://localhost:3000/earrings")
    .then(response => {
        if (!response.ok) {
            throw new Error("Nätverksrespons var inte ok");
        }
        return response.json();
    })
    .catch(error => {
        console.error("Problem med att hämta produkter:", error);
        throw error; 
    });
}

// Show products
showProducts();

// Function to show all products as a card with name, photo, description, price and add-button.
function showProducts() {
    const container = document.getElementById('produkterContainer');
    container.innerHTML = '';
    
    getAllProducts().then(produkter => {
        produkter.forEach(produkt => {
            const kort = `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card">
                    <img src="${produkt.image}" class="card-img-top" alt="${produkt.name}">
                    <div class="card-body">
                        <h5 class="card-title">${produkt.name}</h5>
                        <p class="card-text">${produkt.description}</p>
                        <p class="card-text">Pris: ${produkt.price} kr</p>
                        <p class="card-text">Antal: ${produkt.quantity} i lager</p>
                        <a href="javascript:void(0);" onclick="laggTillIKundvagn('${produkt.name}')" class="btn btn-light">Lägg till</a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += kort;
    });
}).catch(error => {
    container.innerHTML = '<p>Problem med att ladda sidan</p>';
    console.error(error);
});
}

// Function to update cart
function uppdateraKundkorg() {
    const kundkorgLista = document.getElementById('kundkorgLista');
    kundkorgLista.innerHTML = '';

    kundvagn.forEach(produkt => {
        const li = document.createElement('li');
        li.innerText = `${produkt.name} - ${produkt.price} kr`; 
        li.className = 'list-group-item';
        kundkorgLista.appendChild(li);
    });

    localStorage.setItem('kundvagn', JSON.stringify(kundvagn));
}

let kundvagn = [];

// Add to cart function
function laggTillIKundvagn(produktNamn) {
    const produktIndex = kundvagn.findIndex(item => item.produkt.name === produktNamn);
    if (produktIndex > -1) {
        kundvagn[produktIndex].antal +=1;
    }
    else{
        const produkt = products.find(p => p.name === produktNamn);
        if(produkt){
            kundvagn.push({produkt, antal: 1});
        }  
        uppdateraKundkorg(); 
    }

}

// Display cart function
function visaKundkorg() {
    const container = document.getElementById('kundkorgLista');
    container.innerHTML = '';
    let totalSumma = 0;
    
    kundvagn.forEach(item => {
        const totalPris = item.produkt.price * item.antal;
        totalSumma += totalPris;
        const vara = `
            <div class="row mb-2 align-items-center">   
                <div class="col-2">
                    <img src="${item.produkt.image}" alt="${item.produkt.name}" class="img-fluid">
                </div>
                <div class="col-3">
                    <span>${item.produkt.name}</span>
                </div>
                <div class="col-2">
                    <input type="number" class="form-control" value="${item.antal}" min="1" onchange="andraAntal('${item.produkt.namn}', this.value)">
                </div>
                <div class="col-3">
                    <span>Pris: ${item.produkt.price} kr/st</span>
                </div>
                <div class="col-2">
                    <button class="btn btn-danger" onclick="taBortUrKundvagn('${item.produkt.name}')">Ta bort</button>
                </div>
            </div>
        `;
        container.innerHTML += vara;
    });

    container.innerHTML += `<p>Totalsumma: ${totalSumma} kr</p>`;
}

// Change number of items in cart-function
function andraAntal(produktNamn, nyttAntal) {
    const produktIndex = kundvagn.findIndex(item => item.produkt.name === produktNamn);
    if (produktIndex > -1) {
        kundvagn[produktIndex].antal = parseInt(nyttAntal);
        uppdateraKundkorg();
        visaKundkorg();
    }
}

// Delete items from cart-function
function taBortUrKundvagn(produktNamn) {
    const produktIndex = kundvagn.findIndex(item => item.produkt.name === produktNamn);
    if (produktIndex > -1) {
        kundvagn.splice(produktIndex, 1);
        uppdateraKundkorg();
        visaKundkorg();
    }
}

// Funktion to update
function uppdateraProduktIAPi(produktId, uppdateradProdukt) {
    return fetch(`http://localhost:3000/earring/${produktId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(uppdateradProdukt),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Nätverksrespons var inte ok');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Problem med att uppdatera produkten:', error);
    });
}



// Display cart
document.getElementById('visaKundkorgKnapp').addEventListener('click', visaKundkorg);
document.getElementById('visaKundkorgKnapp2').addEventListener('click', visaKundkorg);


// Delete cart
function clearKundkorg(){
    kundvagn=[];
    uppdateraKundkorg();
}

function buy() {
    kundvagn.forEach(item => {
        const nyQuantity = item.produkt.quantity - item.antal;
        if (nyQuantity > 0) {
            uppdateraProduktIAPi(item.produkt.id, { ...item.produkt, quantity: nyQuantity });
            alert("Köp genomfört!");
            getAllProducts();
            showProducts();
        } else {
            alert("Inte tillräckligt med produkter i lager");
        }
    });

    kundvagn = [];
    uppdateraKundkorg();
}

// Get locally saved cart if you reload the page
document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('kundvagn')) {
        kundvagn = JSON.parse(localStorage.getItem('kundvagn'));
        uppdateraKundkorg();
    }
});


