

const GET = async (req,res) => {
    const contacts = await req.fetch(`
	select
	c.*,
	ct.category_name
	from contacts c
	left join categories ct on c.category_id = ct.category_id
	where deleted = false
    `)
	return res.json(contacts)
}
const GetCategories = async (req,res) => {	
    const categories = await req.fetch(`
	select
		*
	from categories
    `)
    return res.json(categories)
}



const SELECT = async (req, res) => {
	const { contactname, phoneNamber , category_id } = req.body
	if(!contactname && !phoneNamber){
		const searchcontacts = await req.fetch(`
		select
			c.*,
			ct.category_name
		from contacts c
		left join categories ct on c.category_id = ct.category_id 
		where
		case
			when $1 > 0 then c.category_id = $1 
			else true
		end and c.deleted = false
		`,category_id)
		console.log(category_id,searchcontacts)
		return res.json(searchcontacts)
	}
	if(!contactname ){
		const searchcontacts = await req.fetch(`
		select
			c.*,
			ct.category_name
		from contacts c
		left join categories ct on c.category_id = ct.category_id
		where
		case
			when length($1) > 0  then c.phoneNamber = $1 
			else true
		end 
		and
		case
			when $2 > 0 then c.category_id = $2
			else true
		end and c.deleted = false`, phoneNamber,category_id)
		
		return res.json(searchcontacts)
	}
	if(!contactname && !category_id){
		const searchcontacts = await req.fetch(`
		select
			c.*,
			ct.category_name
		from contacts c
		left join categories ct on c.category_id = ct.category_id
		where
		case
			when length($1) > 0  then c.phoneNamber = $1 
			else true
		end 
		and c.deleted = false`, phoneNamber)
		return res.json(searchcontacts)
	}
	if(!phoneNamber && !category_id){
		const searchcontacts = await req.fetch(`
		select
			c.*,
			ct.category_name
		from contacts c
		left join categories ct on c.category_id = ct.category_id
		where
		case
			when length($1) > 0  then c.contactname = $1 
			else true
		end 
		and c.deleted = false`,contactname)
		
		return res.json(searchcontacts)
	}
	if(!category_id){
		const searchcontacts = await req.fetch(`
		select
			c.*,
			ct.category_name
		from contacts c
		left join categories ct on c.category_id = ct.category_id
		where
		case
			when length($1) > 0  then c.contactname = $1 
			else true
		end
		and 
		case
			when length($2) > 0 then c.phoneNamber = $2 
			else true
		end and c.deleted = false`,contactname, phoneNamber)
		return res.json(searchcontacts)
	}
	if(!phoneNamber){
		
		const searchcontacts = await req.fetch(`
		select
		c.*,
		ct.category_name
		from contacts c
		left join categories ct on c.category_id = ct.category_id
		where
		case
			when length($1) > 0  then c.contactname = $1 
			else true
		end
		and 
		case
			when $2 > 0 then c.category_id = $2
			else true
		end
		and c.deleted = false
		`,contactname,category_id)
		
		return res.json(searchcontacts)
	}
	
	const searchcontacts = await req.fetch(`
		select
			c.*,
			ct.category_name
		from contacts c
		left join categories ct on c.category_id = ct.category_id
		where
		case
			when length($1) > 0  then c.contactname = $1 
			else true
		end
		and
		case
			when length($2) > 0  then c.phoneNamber = $2 
			else true
		end 
		and
		case
			when $3 > 0 then c.category_id = $3
			else true
		end and c.deleted = false
	`,contactname, phoneNamber,category_id)
	
	return res.json(searchcontacts)
}

const POST = async (req, res) => {
	const { contactname, phoneNamber , category_id , deleted } = req.body

	const newContact = await req.fetch(`
		insert into contacts (
			contactname,
			phoneNamber,
			category_id,
			deleted 
		) values ($1, $2, $3,$4)
		returning contact_id,contactname, phoneNamber,category_id,deleted
	`, contactname, phoneNamber,category_id,deleted)
	
	const contacts = await req.fetch(`
	select * from contacts where deleted = false
	`)

	return res.json(contacts)
}
const PostCategories = async (req, res) => {
	const { category_name } = req.body
	
	const newCategory = await req.fetch(`
		insert into categories (
			category_name
		) values ($1)
		returning category_id,category_name
	`, category_name)
	
	const categories = await req.fetch(`
	select * from categories
	`)
	
	return res.json(categories)
}
const DELETE = async(req,res)=>{

	const {contact_id,deleted } = req.body
	
	const updatedContact  = await req.fetch(`
	UPDATE contacts SET deleted = $1 WHERE contact_id = $2
	returning deleted
	`, deleted, contact_id)
	
	const contacts = await req.fetch(`
	select * from contacts where deleted = false 
	`)
    return res.json(updatedContact) 
}
const DeleteCategories = async(req,res)=>{

	const { category_id } = req.body
	
	const updatedContact  = await req.fetch(`
	DELETE FROM categories WHERE category_id = $1
	`, category_id)
	const updatedCantact  = await req.fetch(`
	UPDATE contacts SET deleted = true WHERE category_id = $1
	returning deleted
	`,category_id)

	const categories = await req.fetch(`
	select * from categories  
	`)
    return res.json(categories) 
}

const UPDATE = async(req,res)=>{

	const {contact_id,contactname, phoneNamber , category_id } = req.body
	
	const updatedContact  = await req.fetch(`
	UPDATE contacts u SET 
		contactname = $2 ,
		phoneNamber = $3,
		category_id = $4
	WHERE contact_id = $1
	returning contactname,phoneNamber,category_id
	`, contact_id , contactname , phoneNamber , category_id)
	

	const contacts = await req.fetch(`
	select
		c.*,
		ct.category_name
	from contacts c
	left join categories ct on c.category_id = ct.category_id
	where deleted = false 
	`)
    return res.json(contacts) 
}
const UpdateCategories = async(req,res)=>{

	const { category_id , category_name} = req.body

	const updatedContact  = await req.fetch(`
	UPDATE categories u SET 
	    category_name = $2 
	WHERE category_id = $1
	returning category_id,category_name
	`, category_id,category_name)
	

	const categories = await req.fetch(`
	select
		*
	from categories
	`)
    return res.json(categories) 
}

module.exports = {
	GET,
	POST,
	DELETE,
	UPDATE,
	SELECT,
	GetCategories,
	PostCategories,
	DeleteCategories,
	UpdateCategories
}
