const myModal = new bootstrap.Modal('#transaction-modal')
const session = localStorage.getItem('session')
let logged = sessionStorage.getItem('logged')
let data = {
  transactions: []
}

document.getElementById('button-logout').addEventListener('click', logout)
document.getElementById('transactions-button').addEventListener('click', function () {
  window.location.href = 'transactions.html'
})

// ADD TRANSACTION
document.getElementById('transaction-form').addEventListener('submit', function (e) {
  e.preventDefault()

  const value = parseFloat(document.getElementById('value-input').value)
  const description = document.getElementById('description-input').value
  const date = document.getElementById('date-input').value
  const type = document.querySelector('input[name="type-input"]:checked').value

  data.transactions.unshift({
    value: value,
    type: type,
    description: description,
    date: date
  })

  saveData(data)
  e.target.reset()
  myModal.hide()

  getCashIn()
  getCashOut()
  getTotal()

  alert('Lançamento adicionado com sucesso.')
})

checkLogged()

function checkLogged() {
  if (session) {
    sessionStorage.setItem('logged', session)
    logged = session
  }

  if (!logged) {
    window.location.href = 'index.html'
    return
  }

  const userData = localStorage.getItem(logged)

  if (userData) {
    data = JSON.parse(userData)
  }

  getCashIn()
  getCashOut()
  getTotal()
}

function logout() {
  sessionStorage.removeItem('logged')
  localStorage.removeItem('session')

  window.location.href = 'index.html'
}

function getCashIn() {
  const transactions = data.transactions
  const cashIn = transactions.filter(item => item.type == '1')

  if (cashIn.length) {
    let cashInHtml = ``
    let limit = 0

    if (cashIn.length > 5) {
      limit = 5
    } else {
      limit = cashIn.length
    }

    for (let index = 0; index < limit; index++) {
      cashInHtml += `
      <div class="row mb-4">
        <div class="col-12">
          <h3 class="fs-2">R$ ${cashIn[index].value.toFixed(2)}</h3>
          <div class="container p-0">
            <div class="row">
              <div class="col-12 col-md-8">
                <p>${cashIn[index].description}</p>
              </div>
              <div class="col-12 col-md-3 d-flex justify-content-end">
                ${cashIn[index].date}
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    }
    
    document.getElementById('cash-in-list').innerHTML = cashInHtml
  }
}

function getCashOut() {
  const transactions = data.transactions
  const cashOut = transactions.filter(item => item.type == '2')

  if (cashOut.length) {
    let cashOutHtml = ``
    let limit = 0

    if (cashOut.length > 5) {
      limit = 5
    } else {
      limit = cashOut.length
    }

    for (let index = 0; index < limit; index++) {
      cashOutHtml += `
      <div class="row mb-4">
        <div class="col-12">
          <h3 class="fs-2">R$ ${cashOut[index].value.toFixed(2)}</h3>
          <div class="container p-0">
            <div class="row">
              <div class="col-12 col-md-8">
                <p>${cashOut[index].description}</p>
              </div>
              <div class="col-12 col-md-3 d-flex justify-content-end">
                ${cashOut[index].date}
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    }

    document.getElementById('cash-out-list').innerHTML = cashOutHtml
  }
}

function getTotal() {
  const transactions = data.transactions
  let total = 0

  transactions.forEach(item => {
    if (item.type === '1') {
      total += item.value
    } else {
      total -= item.value
    }
  })

  if (total == 0) {
    document.getElementById('total').classList.remove('green-text', 'red-text')
  } else if (total > 0) {
    document.getElementById('total').classList.remove('red-text')
    document.getElementById('total').classList.add('green-text')
  } else if (total < 0) {
    document.getElementById('total').classList.remove('green-text')
    document.getElementById('total').classList.add('red-text')
  }

  document.getElementById('total').innerHTML = `R$ ${total.toFixed(2)}`
}

function saveData(data) {
  localStorage.setItem(data.login, JSON.stringify(data))
}
