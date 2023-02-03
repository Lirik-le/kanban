let eventBus = new Vue()

Vue.component('kanban', {
    template: `
        <div class="todolist">
            <div class="formCard">
                <h1>Kanban-доска</h1>
                <div v-show="addCard" class="modalBackgrVis">
                    <add-note class="modalWindow" :changeModal="changeModal"></add-note>
                </div>
                <input class="btn" type="button" value="Добавить задачу" @click="changeModal">
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
                        <card class="card" :card="card"></card>
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
                    <column :testingCards="testingCards"></column>
                </div>
                
                <div>
                    <h2>Выполненные</h2>
                    <column :testingCards="testingCards"></column>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            newCards: [
                {
                    id: 0,
                    task: 243,
                    description: 43242,
                    deadline: 4234,
                    date: new Date().toLocaleString(),
                    completed: false,
                    column: 1,
                },
                {
                    id: 1,
                    task: 243,
                    description: 43242,
                    deadline: 4234,
                    date: new Date().toLocaleString(),
                    completed: false,
                    column: 1,
                },
                {
                    id: 2,
                    task: 243,
                    description: 43242,
                    deadline: 4234,
                    date: new Date().toLocaleString(),
                    completed: false,
                    column: 2,
                }
            ],
            inProgressCards: [],
            testingCards: [],
            completedCard: [],
            addCard: false
        }
    },
    mounted() {
        eventBus.$on('addCard', card => {
            this.newCards.push(card)
        })
    },
    computed: {
        listOne() {
            return this.newCards.filter((card) => card.column === 1)
        },
        listTwo() {
            return this.newCards.filter((card) => card.column === 2)
        },
    },
    methods: {
        changeModal() {
            this.addCard = !this.addCard
        },
        startDrag(evt, card) {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('cardID', card.id)
        },
        onDrop(evt, column) {
            const cardID = evt.dataTransfer.getData('cardID')
            const item = this.newCards.find((item) => item.id === cardID)
            item.column = column
        },
    }
})

Vue.component('card', {
    template: `
        <div>
            <h2>{{ card.id }}</h2>  
            <h2>{{ card.task }}</h2>  
            <p>{{ card.description }}</p>
            <p>{{ card.deadline }}</p>
        </div>
    `,
    props: {
        card: {
            type: Object
        },
    }
})

Vue.component('add-note', {
    template: `
        <form @submit.prevent="sendCard">
            <h1 class="cross" @click="changeModal">+</h1>
            <div class="addCard">
                <p><label for="task">Задача:</label>
                    <input required id="task" v-model="task" placeholder="Задача"></p>
                <p><label for="description">Описание:</label>
                    <input required id="description" v-model="description" placeholder="Описание"></p>
                <p><label  for="deadline">Дедалйн:</label>
                    <input required id="deadline" v-model="deadline" placeholder="Дедлайн"></p>
            </div>
            <input @click="changeModal" class="btn" type="submit" value="Добавить">
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