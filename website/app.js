;(function () {
  /* Global Variables */
  const apiKey = "82b20c7d14222e3f7f7fe39b3c0a814e&units=imperial"
  const weatherApi = "https://api.openweathermap.org/data/2.5/weather"
  const domain =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://fend-weather-journal.onrender.com"
  const severApi = `${domain}/journals`
  const form = document.querySelector("#form")
  const template = document.querySelector("#template")
  const errorEl = document.querySelector("#error-message")

  // values of reactive variables
  let _journals = []
  let _errorMessage = null
  // ends here

  const store = {}
  let zip = null
  let feeling = null

  Object.defineProperty(store, "journals", {
    set(updatedList) {
      _journals = updatedList
      render()
    },
    get() {
      return _journals
    },
  })

  Object.defineProperty(store, "error", {
    set(val) {
      _errorMessage = val
      errorEl.textContent = val
    },
    get() {
      return _errorMessage
    },
  })

  function getInputValue(selector) {
    return document.querySelector(selector)?.value || null
  }

  function getWeatherData() {
    store.error = ""
    const url = `${weatherApi}?zip=${zip}&APPID=${apiKey}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.cod === "404") {
          store.error = "Zip code not found, please try with another code"
        } else {
          createJournal(data)
        }
      })
      .catch(err => {
        console.error(err)
        store.error = "Uh hoo! Something went wrong!"
      })
  }

  function createJournal(weather) {
    const payload = { zip, feeling, ...weather }
    fetch(severApi, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        store.journals = [data.journal, ...store.journals]
      })
      .catch(err => {
        console.error(err)
        store.error = "Uh hoo! Something went wrong!"
      })
  }

  function updateText(node, selector, text) {
    node.querySelector(selector).textContent = text
  }

  function render() {
    const frag = document.createDocumentFragment()
    store.journals.forEach(item => {
      const temp = template.content.cloneNode(true)
      updateText(temp, ".city", item.name)
      updateText(temp, ".date", new Date(item.created_at).toLocaleDateString())
      updateText(temp, ".temp", `${item.main.temp}° F`)
      updateText(temp, ".feeling", item.feeling)
      frag.appendChild(temp)
    })
    document.querySelector("#entries").innerHTML = ""
    document.querySelector("#entries").append(frag)
  }

  form.addEventListener("submit", e => {
    e.preventDefault()
    zip = getInputValue("#zip")
    feeling = getInputValue("#feelings")
    getWeatherData()
  })
})()
