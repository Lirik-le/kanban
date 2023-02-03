let eventBus = new Vue()

Vue.component('kanban', {
    template: `
        <div class="todolist">
            <div class="formCard">
                <h1>Kanban-доска</h1>
                <div v-show="modal" class="modalBackgrVis">
                    <add-note class="modalWindow" :changeModal="changeModal"></add-note>
                </div>
                <input class="btn" type="button" value="Добавить задачу" @click="changeModal">


                <div v-show="changeCard" class="modalBackgrVis">
                    <form @submit.prevent="" class="modalWindow">
                        <h1 class="cross" @click="changeModalCard">+</h1>
                        <div class="addCard">
                            <div>
                                <p><label for="task">Задача:</label></p>
                                <input required id="task" v-model="taskChange" placeholder="Задача">
                            </div>
                            
                            <div>
                                <p><label for="description">Описание:</label></p>
                                <textarea required id="description" v-model="descChange" placeholder="Описание"></textarea>
                            </div>
                            
                            <div>
                                <p><label  for="deadline">Дедалйн:</label></p>
                                <input required id="deadline" v-model="dlChange" placeholder="Дедлайн" type="date">
                            </div>
                        </div>
                        <input @click="changeModalCard" class="btn addBtn" type="submit" value="Добавить">
                    </form>
                </div>
                
            </div>
            <div class="columns">
            
                <div
                    @drop="onDrop($event, 1)"
                    @dragover.prevent
                    @dragenter.prevent
                >
                    <h2>Новые</h2>
                    <div 
                        v-for="card in listOne"
                        :key="card.task"
                        draggable
                        @dragstart="startDrag($event, card)"
                    >
                        <card 
                            class="card"
                            :card="card"
                            :changeModal="changeModal"
                            :modal="modal"
                            :changeModalCard="changeModalCard"
                            :saveId="saveId"></card>
                    </div>
                </div>
                
                <div 
                    @drop="onDrop($event, 2)"
                    @dragover.prevent
                    @dragenter.prevent
                >
                    <h2>В прогрессе</h2>
                    <div 
                        v-for="card in listTwo"
                        :key="card.task"
                        draggable
                        @dragstart="startDrag($event, card)"
                    >
                        <card class="card" :card="card"></card>
                    </div>
                </div>
                
                <div>
                    <h2>Выполненные</h2>
                    <column></column>
                </div>
                
                <div>
                    <h2>Выполненные</h2>
                    <column></column>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            allCards: [],
            modal: false,
            changeCard: false,
            idChange: null,
            taskChange: null,
            descChange: null,
            dlChange: null
        }
    },
    mounted() {
        eventBus.$on('addCard', card => {
            this.allCards.push(card)
        })
    },
    computed: {
        listOne() {
            return this.allCards.filter((card) => card.column === 1)
        },
        listTwo() {
            return this.allCards.filter((card) => card.column === 2)
        },
    },
    methods: {
        changeModal() {
            this.modal = !this.modal
        },
        changeModalCard() {
            this.changeCard = !this.changeCard
        },
        saveId(card) {
            this.idChange = card.id
        },
        updateCard(item) {
            let card = this.allCards.find((item) => item.id === this.idChange)
        },
        startDrag(evt, card) {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('cardID', card.id)
        },
        onDrop(evt, column) {
            const cardID = evt.dataTransfer.getData('cardID')
            const item = this.allCards.find((item) => item.id === cardID)
            item.column = column
        },
    }
})

Vue.component('card', {
    template: `
        <div>
            <h2>{{ card.task }}</h2>  
            <p>{{ card.description }}</p>
            <p>{{ card.deadline }}</p>
            <input class="btn" type="button" value="Изменить" @click="updateCard" @click="changeModalCard" @click="saveId(card)">
        </div>
    `,
    props: {
        card: {
            type: Object
        },
        changeModalCard: {
            type: Function
        },
        saveId: {
            type: Function
        },
        updateCard: {
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
                completed: false,
                column: 1,
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