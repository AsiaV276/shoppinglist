class Model {
    constructor() {
        // the state of the model, array of item objects, prepopulated with data
        this.items = [
            {id: 1, text:'mamgos', complete: false},
        ]
    }

    addItem(itemtext) {
        const item = {
            // if the condition is true then this.items[this.items.length - 1].id + 1, otherwise 1
            id: this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 1,
            text: itemtext,
            complete: false,
        }

        // add the item to the end of the array
        this.item.push(item)
    }

    // maps through items, finds the id, and replaces the text with the new text
    editItem(id, updatedText) {
        this.items = this.items.map(item => 
            item.id === id ? {id: item.id, text: updatedText, complete: item.complete} : item)
    }

    // filter a item out of the array by the id
    deleteItem(id) {
        // returns an array of every item minus the item with the indicated id
        // the filter method returns an array of all the matching elements, all that are true
        this.items = this.items.filter(item => item.id !== id)
    }

    // flips the complete boolean property on the specified item between true and false
    toggleItem(id) {
        this.items = this.items.map(item =>
            item.id === id ? {id: item.id, text: item.text, complete: !item.complete} : item)

    }

  }
  
  app.model.addItem('water')



  class View {
    constructor() {

    }
  }
  




  class Controller {
    constructor(model, view) {
      this.model = model
      this.view = view
    }
  }
  
  //this app is an instance of the controller
  const app = new Controller(new Model(), new View())
