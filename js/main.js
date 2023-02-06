let eventBus = new Vue()
let now = new Date()

Vue.component('kanban', {
    template: `
        <div class="todolist">
            <div class="formCard">
                <h1>Kanban-доска</h1>
                <div v-show="modal" class="modalBackgrVis">
                    <add-note :saveCard="saveCard" class="modalWindow" :changeModal="changeModal"></add-note>
                </div>
                <input class="btn" type="button" value="Добавить задачу" @click="changeModal">
            </div>
            <div class="columns">
                <div>
                    <h2>Запланированные задачи</h2>
                    <div class="card columnOne"
                         v-for="card in listOne">
                        <card
                            :card="card"
                            :removeCard="removeCard"
                            :changeColumn="changeColumn"
                            :goBack="goBack"
                            :saveCard="saveCard">
                        </card>
                    </div>
                </div>
                
                <div>
                    <h2>Задачи в работе</h2>
                    <div class="card columnTwo"
                         v-for="card in listTwo">
                        <card
                            :card="card"
                            :removeCard="removeCard"
                            :changeColumn="changeColumn"
                            :goBack="goBack"
                            :saveCard="saveCard">
                        </card>
                    </div>
                </div>
                
                <div>
                    <h2>Тестирование</h2>
                    <div class="card columnThree"
                         v-for="card in listThree">
                        <card
                            :card="card"
                            :removeCard="removeCard"
                            :changeColumn="changeColumn"
                            :goBack="goBack"
                            :saveCard="saveCard">
                        </card>
                    </div>
                </div>
                
                <div>
                    <h2>Выполненные задачи</h2>
                    <div class="card columnFour"
                         :class="{overdue: !card.completed}"
                         v-for="card in listFour">
                        <card
                            :card="card"
                            :removeCard="removeCard"
                            :changeColumn="changeColumn"
                            :goBack="goBack"
                            :saveCard="saveCard">
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
        }
    },
    mounted() {
        this.allCards = JSON.parse(localStorage.getItem("allCardLS"))
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
            this.saveCard()
        },
        changeColumn(card) {
            card.column++
            this.saveCard()
        },
        goBack(card) {
            card.wasComingBack = true
            card.column--
            this.saveCard()
        },
        saveCard() {
            localStorage.setItem('allCardLS', JSON.stringify(this.allCards))
            console.log(JSON.parse(localStorage.getItem("allCardLS")))
        }
    }
})

Vue.component('card', {
    template: `
        <div>
            <div>
                <h1 class="cross crossCard" @click="removeCard(card)" v-show="card.column === 1">+</h1>
            </div>
            <h2>{{ card.task }}</h2>  
            <p>{{ card.description }}</p>
            <h4>Дата сдачи:</h4>
            <span>{{ card.deadline }}</span>
            <h4>Дата создания</h4>
            <span>{{ card.date }}</span>
            <h4 v-show="card.dateChange != null">Дата изменения</h4>
            <span v-show="card.dateChange != null">{{ card.dateChange }}</span>
            <h4 v-show="card.whyGoBack.length > 0">Причины возврата</h4>
            <ul>
                <li v-for="reas in card.whyGoBack">
                    {{ reas }}
                </li>
            </ul>
            <h3 v-show="card.completed && card.column === 4">Выполнена в срок</h3>
            <h3 v-show="!card.completed && card.column === 4">Просрочена</h3>
            
            <div v-show="cardModel" class="modalBackgrVis">
                <div class="modalWindow">
                    <form>
                        <h1 class="cross crossChange" @click="changeCardModal">+</h1>
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
                        <input @click.prevent="addDateChange(card)" @click="changeCardModal" class="btn addBtn" type="button" value="Изменить">
                    </form>
                </div>
            </div>
            
            <div v-show="card.wasComingBack" class="modalBackgrVis">
                <div class="modalWindow">
                    <form  @submit.prevent="reasonForGoingBack(card)">
                        <div class="addCard">
                            <div>
                                <p><label for="reason">Причина возврата:</label></p>
                                <input required id="reason" v-model="reason" placeholder="Замечания заказчика">
                            </div>
                        </div>
                        <input class="btn addBtn" type="submit" value="Изменить">
                    </form>
                </div>
            </div>
            
            <div>
                <input v-show="card.column <= 3" class="btn" type="button" value="Изменить" @click="changeCardModal">
                <input v-show="card.column === 3" class="btn" type="button" value="Вернуться назад" @click="goBack(card)">
                <input v-show="card.column != 4" class="btn" type="button" value="Перейти дальше" @click.prevent="changeColumn(card), dateCompare(card)">
            </div>
        </div>
    `,
    data() {
        return {
            cardModel: false,
            reason: '',
        }
    },
    methods: {
        changeCardModal() {
            this.cardModel = !this.cardModel
        },
        addDateChange(card) {
            card.dateChange = new Date().toLocaleString()
            this.saveCard()
        },
        dateCompare(card) {
            if (card.column === 4 && new Date(card.deadline) < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
                card.completed = false
            }
            this.saveCard()
        },
        reasonForGoingBack(card) {
            card.whyGoBack.push(this.reason)
            this.reason = ''
            card.wasComingBack = false
            this.saveCard()
        }
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
        goBack: {
            type: Function
        },
        saveCard: {
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
                    <label for="task">Задача:</label>
                    <input name="qwe1" required id="task" v-model="task" placeholder="Задача">
                </div>
                
                <div>
                    <label for="description">Описание:</label>
                    <textarea name="qwe2" required id="description" v-model="description" placeholder="Описание"></textarea>
                </div>
                
                <div>
                    <label for="deadline">Дедалйн:</label>
                    <input name="qwe3" required id="deadline" v-model="deadline" placeholder="Дедлайн" type="date">
                </div>
            </div>
            <input @click="changeModal" class="btn addBtn" type="submit" value="Добавить">
        </form>
    `,
    props: {
        changeModal: {
            type: Function
        },
        saveCard: {
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
                whyGoBack: [],
                wasComingBack: false,
                completed: true,
            }
            eventBus.$emit('addCard', card)
            this.saveCard()
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