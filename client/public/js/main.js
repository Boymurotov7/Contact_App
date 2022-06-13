const tbody = document.querySelector('#tbody')
const form = document.querySelector('#form')
const form1 = document.querySelector('#form1')
const contactnameInput = document.querySelector('#usernameInput')
const NumberInput = document.querySelector('#numberInput')
const categoryInput = document.querySelector('#categoryInput')
async function renderCategories () {
		const categories = await request('/contacts/categories', 'GET')
		const cantactCategories = []
		for(let index in categories) {
			//const cantactCategories = []
			let categoryEl = { 
				category_name:categories[index].category_name,
				category_id:categories[index].category_id
			}
			cantactCategories.push(categoryEl)
		}
		return cantactCategories
	}
async function renderCategory () {
	const categories = await renderCategories () 
	categories.forEach(k => {
		const [el] = createElements('option')
		el.textContent = k.category_name
		el.category_id = k.category_id
		categoryInput.append(el)
})}
async function renderContacts () {
	const contacts = await request('/contacts', 'GET')
	tbody.innerHTML = null
	for(let index in contacts) {
		const [
			tr,
			indexEl,
			userEl,
			numberEl,
			categoryEl,
			buttonEl,
			categorySelectEl,
			buttonRemoveEl
		] = createElements('tr', 'td', 'td', 'td', 'td', 'td','select','button')
		
		const category = await renderCategories()
		
		category.forEach(j => {
			const [el] = createElements('option')
			el.textContent = j.category_name
			el.category_id = j.category_id
			categorySelectEl.append(el)
			
		})
		
	
		indexEl.textContent = +index + 1
		userEl.textContent = contacts[index].contactname
		numberEl.textContent = contacts[index].phonenamber
		
		buttonRemoveEl.textContent = 'X'

		
		userEl.contentEditable = true
		numberEl.contentEditable = true		
		
		for(let i = 0; i < categorySelectEl.length; i++){
			if(contacts[index].category_name === categorySelectEl[i].textContent) categorySelectEl[i].selected = true
		}
	
		
		categoryEl.append(categorySelectEl)
		buttonEl.append(buttonRemoveEl)
		tr.append(indexEl, userEl, numberEl, categoryEl, buttonEl)
		tbody.append(tr)


		userEl.onkeypress = event => {
			if(!(event.keyCode === 13)) return
			userEl.textContent = userEl.textContent.trim()
			userEl.blur()
			if (! userEl.textContent)return alert("You must enter name")
			changeUser(contacts[index].contact_id, userEl.textContent,numberEl.textContent,categorySelectEl[index].category_id)
		}

		numberEl.onkeypress = event => {
			if(!(event.keyCode === 13)) return
			numberEl.textContent = numberEl.textContent.trim()
			numberEl.blur()
			let number = new RegExp(/^[+]{1}998[0-9]{2}[0-9]{7}$/)
     		if(!number.test(numberEl.textContent) || numberEl.textContent == null)return alert("You must enter number exemple : 998941234567 or enter nothing")
			changeUser(contacts[index].contact_id, userEl.textContent,numberEl.textContent,categorySelectEl[index].category_id)
		}
		categorySelectEl.onchange = event => {
			for(let i = 0; i < categorySelectEl.length; i++){
				if(categorySelectEl.value === categorySelectEl[i].textContent) {
					categorySelectEl[index].category_id = categorySelectEl[i].category_id
				}
			}
			changeUser(contacts[index].contact_id, userEl.textContent,numberEl.textContent,categorySelectEl[index].category_id)
		}
		buttonRemoveEl.onclick = event => {
			tr.remove()
			deleteUser(contacts[index].contact_id)
		}
	}
}


async function changeUser (contact_id, contactname, phoneNamber, category_id) {
	let response = await request('/contacts', 'PUT', {
		contact_id,
		contactname,
		phoneNamber,
		category_id,
	})
	
}

async function deleteUser (contact_id) {
	let response = await request('/contacts', 'DELETE', {
		contact_id,
		deleted:true,
	})
}

form.onsubmit = async event => {
	event.preventDefault()
	
	const category = await renderCategories()
	let number = new RegExp(/^[+]{1}998[0-9]{2}[0-9]{7}$/);
    if (!number.test(NumberInput.value) && NumberInput.value == null)return alert("You must enter number exemple : 998941234567 or enter nothing");
	category.forEach(el => {
	   if(categoryInput.value == el.category_name)
		  category_id = el.category_id
	}) 
	

	let response = await request('/contacts/search', 'POST',{
			contactname: contactnameInput.value,
			phoneNamber: NumberInput.value,
			category_id: category_id,
			//category_name: category_name,
			deleted: false
		})

	let contacts = response
	contactnameInput.value = null
	NumberInput.value = null
	tbody.innerHTML = null
	
	for(let index in contacts) {
		const [
			tr,
			indexEl,
			userEl,
			numberEl,
			categoryEl,
			buttonEl,
			categorySelectEl,
			buttonRemoveEl
		] = createElements('tr', 'td', 'td', 'td', 'td', 'td', 'select', 'button')
		
		

		category.forEach(j => {
			const [el] = createElements('option')
			el.textContent = j.category_name
			el.category_id = j.category_id
			categorySelectEl.append(el)
			
		}) 

		indexEl.textContent = +index + 1
		userEl.textContent = contacts[index].contactname
		numberEl.textContent = contacts[index].phonenamber
		
		buttonRemoveEl.textContent = 'X'

		
		userEl.contentEditable = true
		numberEl.contentEditable = true

		
		for(let i = 0; i < categorySelectEl.length; i++){
			if(contacts[index].category_name === categorySelectEl[i].textContent) categorySelectEl[i].selected = true
		}
	
		categoryEl.append(categorySelectEl)
		
		buttonEl.append(buttonRemoveEl)
		tr.append(indexEl, userEl, numberEl, categoryEl, buttonEl)
		tbody.append(tr)


		userEl.onkeypress = event => {
			if(!(event.keyCode === 13)) return
			userEl.textContent = userEl.textContent.trim()
			userEl.blur()
			if (! userEl.textContent)return alert("You must enter name")
			changeUser(contacts[index].contact_id, userEl.textContent,numberEl.textContent,categorySelectEl[index].category_id)
		}

		numberEl.onkeypress = event => {
			if(!(event.keyCode === 13)) return
			numberEl.textContent = numberEl.textContent.trim()
			numberEl.blur()
			let number = new RegExp(/^[+]{1}998[0-9]{2}[0-9]{7}$/);
     		if (!number.test(numberEl.textContent) || numberEl.textContent == null){
				return alert("You must enter number exemple : 998941234567 or enter nothing");
			} 
	
			changeUser(contacts[index].contact_id, userEl.textContent,numberEl.textContent,categorySelectEl[index].category_id)
		}
		categorySelectEl.onchange = event => {
			for(let i = 0; i < categorySelectEl.length; i++){
				if(categorySelectEl.value === categorySelectEl[i].textContent) {
					categorySelectEl[index].category_id = categorySelectEl[i].category_id
				}
			}
			changeUser(contacts[index].contact_id, userEl.textContent,numberEl.textContent,categorySelectEl[index].category_id)
		}
		buttonRemoveEl.onclick = event => {
			tr.remove()
			deleteUser(contacts[index].contact_id)
		}
	}
}
	

form1.onsubmit = async event => {
	event.preventDefault()
	const category = await renderCategories()
	if(!contactnameInput || !NumberInput || !categoryInput) return alert('Inputs must be filled!')
	let number = new RegExp(/^[+]{1}998[0-9]{2}[0-9]{7}$/);
	if (!number.test(NumberInput.value))return alert("You must enter number exemple : 998941234567");
	
	category.forEach(el => {
		if(categoryInput.value == el.category_name) category_id = el.category_id
	 }) 
	
	let response = await request('/contacts', 'POST', {
		contactname: contactnameInput.value,
		phoneNamber: NumberInput.value,
		category_id: category_id,
		deleted: false
	})
	console.log(response)


	contactnameInput.value = null
	NumberInput.value = null
	categoryInput.value = null

	renderContacts()
}
renderCategory ()
renderContacts()