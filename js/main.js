let eventBus = new Vue()
let now = new Date()
Vue.component('kanban', {
    template: `
        <div class="todolist">
            <div class="formCard">
                <h1>Kanban-доска</h1>
                <div v-show="modal" class="modalBackgrVis">
                    <add-note class="modalWindow" :changeModal="changeModal"></add-note>
                </div>
                <input class="btn" type="button" value="Добавить задачу" @click="changeModal">
            </div>
            <div class="columns">
                <div>
                    <h2>Запланированные задачи</h2>
                    <div class="card"
                         v-for="card in listOne">
                        <card
                            :card="card"
                            :removeCard="removeCard"
                            :changeColumn="changeColumn"
                            :changeCardModal="changeCardModal">
                        </card>
                    </div>
                </div>
                
                <div>
                    <h2>Задачи в работе</h2>
                    <div class="card"
                         v-for="card in listTwo">
                        <card
                            :card="card"
                            :removeCard="removeCard"
                            :changeColumn="changeColumn"
                            :changeCardModal="changeCardModal">
                        </card>
                    </div>
                </div>
                
                <div>
                    <h2>Тестирование</h2>
                    <div class="card"
                         v-for="card in listThree">
                        <card
                            :card="card"
                            :removeCard="removeCard"
                            :changeColumn="changeColumn"
                            :changeCardModal="changeCardModal">
                        </card>
                    </div>
                </div>
                
                <div>
                    <h2>Выполненные задачи</h2>
                    <div class="card"
                         v-for="card in listFour">
                        <card
                            :card="card"
                            :removeCard="removeCard"
                            :changeColumn="changeColumn"
                            :changeCardModal="changeCardModal">
                        </card>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            allCards: [],
            modal: false,
            cardModel: false,
        }
    },
    mounted() {
        eventBus.$on('addCard', card => {
            this.allCards.push(card)
        })
    },
    computed: {
        listOne() {
            return this.allCards.filter((item) => item.column === 1)
        },
        listTwo() {
            return this.allCards.filter((item) => item.column === 2)
        },
        listThree() {
            return this.allCards.filter((item) => item.column === 3)
        },
        listFour() {
            return this.allCards.filter((item) => item.column === 4)
        },
    },
    methods: {
        changeModal() {
            this.modal = !this.modal
        },
        removeCard(card) {
            this.allCards.splice(this.allCards.indexOf(card), 1)
            console.log(this.allCards)
        },
        changeColumn(card) {
            card.column++
        },
        changeCardModal() {
            this.cardModel = !this.cardModel
        },
    }
})

Vue.component('card', {
    template: `
        <div>
            <h1 @click="removeCard(card)" v-show="card.column === 1">+</h1>
            <h2>{{ card.task }}</h2>  
            <p>{{ card.description }}</p>
            <h4>Дата сдачи:</h4>
            <span>{{ card.deadline }}</span>
            <h4>Дата создания</h4>
            <span>{{ card.date }}</span>
            <h4 v-show="card.dateChange != null">Дата изменения</h4>
            <span v-show="card.dateChange != null">{{ card.dateChange }}</span>
            <h3 v-show="card.completed && card.column === 4">Выполнена в срок</h3>
            <h3 v-show="!card.completed && card.column === 4">Просрочена</h3>
            
            <div v-show="cardModel" class="modalBackgrVis">
                <div class="modalWindow">
                    <form>
                        <h1 class="cross" @click="changeCardModal">+</h1>
                        <div class="addCard">
                            <div>
                                <p><label for="task">Задача:</label></p>
                                <input required id="task" v-model="card.task" placeholder="Задача">
                            </div>
                        
                            <div>
                                <p><label for="description">Описание:</label></p>
                                <textarea required id="description" v-model="card.description" placeholder="Описание"></textarea>
                            </div>
                        
                            <div>
                                <p><label  for="deadline">Дедалйн:</label></p>
                                <input required id="deadline" v-model="card.deadline" placeholder="Дедлайн" type="date">
                            </div>
                        </div>
                        <input @click.prevent="changeCardModal" @click="addDateChange(card)" class="btn addBtn" type="submit" value="Изменить">
                    </form>
                </div>
            </div>
            
            <div>
                <input v-show="card.column <= 3" class="btn" type="button" value="Изменить" @click="changeCardModal">
                <input v-show="card.column != 4" class="btn" type="button" value="Перейти дальше" @click="changeColumn(card)" @click="dateCompare(card)">
            </div>
        </div>
    `,
    data() {
        return {
            cardModel: false,
        }
    },
    methods: {
        changeCardModal() {
            this.cardModel = !this.cardModel
        },
        addDateChange(card) {
            card.dateChange = new Date().toLocaleString()
        },
        dateCompare(card) {
            if (card.column === 4 && new Date(card.deadline) < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
                card.completed = false
            }
        },
    },
    props: {
        card: {
            type: Object
        },
        removeCard: {
            type: Function
        },
        changeColumn: {
            type: Function
        },
        changeCardModal: {
            type: Function
        }
    },
})

Vue.component('add-note', {
    template: `
        <form @submit.prevent="sendCard">
            <h1 class="cross" @click="changeModal">+</h1>
            <div class="addCard">
                <div>
                    <p><label for="task">Задача:</label></p>
                    <input required id="task" v-model="task" placeholder="Задача">
                </div>
                
                <div>
                    <p><label for="description">Описание:</label></p>
                    <textarea required id="description" v-model="description" placeholder="Описание"></textarea>
                </div>
                
                <div>
                    <p><label  for="deadline">Дедалйн:</label></p>
                    <input required id="deadline" v-model="deadline" placeholder="Дедлайн" type="date">
                </div>
            </div>
            <input @click="changeModal" class="btn addBtn" type="submit" value="Добавить">
        </form>
    `,
    props: {
        changeModal: {
            type: Function
        }
    },
    data() {
        return {
            id: 0,
            task: null,
            description: null,
            deadline: null,
        }
    },
    methods: {
        sendCard() {
            let card = {
                id: this.id,
                task: this.task,
                description: this.description,
                deadline: this.deadline,
                date: new Date().toLocaleString(),
                dateChange: null,
                column: 1,
                completed: true
            }
            eventBus.$emit('addCard', card)
            this.task = null
            this.description = null
            this.deadline = null
            this.id = this.id + 1
        }
    },
})

let app = new Vue({
    el: '#app'
})