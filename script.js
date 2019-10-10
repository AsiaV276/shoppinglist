class Model {
    constructor() {
        // the state of the model, array of item objects, prepopulated with data
        this.items = JSON.parse(localStorage.getItem('items')) || []
    }

    addItem(itemText) {
        const item = {
            // if the condition is true then this.items[this.items.length - 1].id + 1, otherwise 1
            id: this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 1,
            text: itemText,
            complete: false,
        }

        // add the item to the end of the array
        this.items.push(item)
    }

    // maps through items, finds the id, and replaces the text with the new text
    editItem(id, updatedText) {
        this.items = this.items.map(item => 
            item.id === id ? {id: item.id, text: updatedText, complete: item.complete} : item)

        this.onItemListChanged(this.items)
        this._commit(this.items)
    }

    // filter a item out of the array by the id
    deleteItem(id) {
        // returns an array of every item minus the item with the indicated id
        // the filter method returns an array of all the matching elements, all that are true
        this.items = this.items.filter(item => item.id !== id)

        this.onItemListChanged(this.items)
        this._commit(this.items)
    }

    // flips the complete boolean property on the specified item between true and false
    toggleItem(id) {
        this.items = this.items.map(item =>
            item.id === id ? {id: item.id, text: item.text, complete: !item.complete} : item)
        
        this.onItemListChanged(this.items)
        this._commit(this.items)
    }

    bindItemListChanged(callback) {
        this.onItemListChanged = callback
    }

    _commit(items) {
        this.onItemListChanged(items)
        localStorage.setItem('items', JSON.stringify(items))
    }

  }
  



  class View {
    constructor() {

        // root element
        this.app = this.getElement('#root')

        // title of the app
        this.title = this.createElement('h1')
        this.title.textContent = 'Shopping List App'

        // Input and submit button form
        this.form = this.createElement('form')

        this.input = this.createElement('input')
        this.input.type = 'text'
        this.input.placeholder = 'Add an item'
        this.input.name = 'item'

        this.addButton = this.createElement('button')
        this.addButton.textContent = 'Add'

        // the visual of the item list
        this.itemList = this.createElement('ol', 'item-list')

        // Append input and addButton to the form
        this.form.append(this.input, this.addButton)
       
       // Append the title, form, and list to the app
        this.app.append(this.title, this.form, this.itemList)

        //making the item text editable w/o ...
        this._temporaryItemText
        this._initLocalListeners() 
    }

        // update temporary state
        _initLocalListeners() {
            this.itemList.addEventListener('input', event => {
                if (event.target.className === 'editable') {
                    this._temporaryItemText = event.target.innerText
                }
            })
        }

        // send the completed value to the model
        bindEditItem(handler) {
            this.itemList.addEventListener('focusout', event => {
                if (this._temporaryItemText) {
                    const id = parseInt(event.target.parentElement.id)

                    handler(id, this._temporaryItemText)
                    this._temporaryItemText = ''
                }
            })
        }
        // create an element with an optional css class
        createElement(tag, className){
            const element = document.createElement(tag)
            if (className) element.classList.add(className)

            return element
        }

        // retrieve an element from the DOM
        getElement(selector) {
            const element = document.querySelector(selector)

            return element
        }
    
        // getter and resetter of the new input item value. private(local) methods
        get _itemText() {
            return this.input.value
        }
        _resetInput() {
            this.input.value = ''
        }

        displayItems(items) {
            // delete all nodes
            while (this.itemList.firstChild) {
                this.itemList.removeChild(this.itemList.firstChild)
            }

            // show default message when the list is empty
            if (items.length === 0) {
                const p = this.createElement('p')
                p.textContent = 'Your shopping list is empty. Add an item!'
                this.itemList.append(p)
            } 
            else {
                // create item nodes for each item in state
                items.forEach(item => {
                    const li = this.createElement('li')
                    li.id = item.id

                    // each item has a checkbox to toggle
                    const checkbox = this.createElement('input')
                    checkbox.type = 'checkbox'
                    checkbox.checked = item.complete

                    // item text is in a contenteditable span
                    const span = this.createElement('span')
                    span.contentEditable = true
                    span.classList.add('editable')

                    // the text will have a strikethrough when the item is checked off, complete
                    if (item.complete) {
                        const strike = this.createElement('s')
                        strike.textContent = item.text
                        span.append(strike)
                    }
                    else {
                        // text displayed without strikethrough when item is unchecked, incomplete
                        span.textContent = item.text
                    }

                    // delete item on the items
                    const deleteButton = this.createElement('button', 'delete')
                    deleteButton.textContent = 'Delete' // replace with the trash icon
                    
                    // append checkbox, span, and deleteButton to the li node
                    li.append(checkbox, span, deleteButton)

                    // append li nodes to the itemList
                    this.itemList.append(li)
                })
            }
        }


  }
  




  class Controller {
    constructor(model, view) {
      this.model = model
      this.view = view

      this.view.bindAddItem(this.handleAddItem)
      this.view.bindDeleteItem(this.handleDeleteItem)
      this.view.bindToggleItem(this.handleToggleItem)
      this.view.bindEditItem(this.handleEditItem)

      this.model.bindItemListChanged(this.onItemListChanged)

    

      //display initial items
      this.onItemListChanged(this.model.items)
    }

    // the model fires back to the controller
    onItemListChanged = items => {
        this.view.displayItems(items)
    }

    // Handlers. handles the events after they are fired, dispatches responsiblility of what happens in response to the event
    handleAddItem = itemText => {
        this.model.addItem(itemText)
    }

    handleEditItem = (id, itemText) => {
        this.model.editItem(id, itemText)
    }

    handleDeleteItem = id => {
        this.model.deleteItem(id)
    }

    handleToggleItem = id => {
        this.model.toggleItem(id)
    }

    // Event listeners. Putting event listeners on the DOM elements in the view
    bindAddItem(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault()

            if (this._itemText) {
                handler(this._itemText)
                this._resetInput()
            }
        })
    }

    bindDeleteItem(handler) {
        this.itemList.addEventListener('click', event => {
            if (event.target.className ==='delete') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }

    bindToggleItem(handler) {
        this.itemList.addEventListener('change', event => {
            if (event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }
  }
  
  //this app is an instance of the controller
  const app = new Controller(new Model(), new View())

  //app.model.addItem('water')
