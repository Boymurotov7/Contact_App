const tbody = document.querySelector('#tbody')
const form = document.querySelector('#form')
const categorynameInput = document.querySelector('#categorynameInput')


async function renderCategories() {
	const categories = await request('/contacts/categories', 'GET')
	
	tbody.innerHTML = null
	for(let index in categories) {
		const [
			tr,
			indexEl,
			categoryEl,
			buttonEl,
			buttonRemoveEl
		] = createElements('tr', 'td', 'td','td','button')
		
		indexEl.textContent = +index + 1
		categoryEl.textContent = categories[index].category_name
		
		buttonRemoveEl.textContent = 'X'

		
		categoryEl.contentEditable = true	
		
		buttonEl.append(buttonRemoveEl)
		tr.append(indexEl, categoryEl,buttonEl)
		tbody.append(tr)


		categoryEl.onkeypress = event => {
			if(!(event.keyCode === 13)) return
			categoryEl.textContent = categoryEl.textContent.trim()
			categoryEl.blur()
			if (!categoryEl.textContent)return alert("You must enter name")
			changecategory(categories[index].category_id, categoryEl.textContent)
		}

		buttonRemoveEl.onclick = event => {
			tr.remove()
			deletecategory(categories[index].category_id)
		}
	}
}


async function changecategory (category_id, category_name) {
	let response = await request('/categories', 'PUT', {
		category_id,
		category_name
	})
}

async function deletecategory (category_id) {
	let response = await request('/categories', 'DELETE', {
		category_id
	})
}

form.onsubmit = async event => {
	event.preventDefault()
	if (!categorynameInput.value)return alert("You must enter name")
    let response = await request('/categories', 'POST',{
			category_name: categorynameInput.value
		})
    let categories =  response

	categorynameInput.value = null
	
	tbody.innerHTML = null
	
	for(let index in categories) {
		const [
			tr,
			indexEl,
			categoryEl,
			buttonEl,
			buttonRemoveEl
		] = createElements('tr', 'td', 'td','td', 'button')
		
		

		indexEl.textContent = +index + 1
		categoryEl.textContent = categories[index].category_name
		
		buttonRemoveEl.textContent = 'X'

		
		categoryEl.contentEditable = true
		
		
		
		buttonEl.append(buttonRemoveEl)
		tr.append(indexEl, categoryEl,buttonEl)
		tbody.append(tr)


		categoryEl.onkeypress = event => {
			if(!(event.keyCode === 13)) return
			categoryEl.textContent = categoryEl.textContent.trim()
			categoryEl.blur()
			if (! categoryEl.textContent)return alert("You must enter name")
			changecategory(categories[index].category_id, categoryEl.textContent)
		}

		
		buttonRemoveEl.onclick = event => {
			tr.remove()
			deletecategory(categories[index].category_id)
		}
	}
}

renderCategories()
