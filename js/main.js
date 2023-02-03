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
            </div>
           
            <div class="columns">
                <div>
                    <h2>Новые</h2>
                    <card class="card" v-for="card in allCards" :card="card"></card>
                </div>
                
                <div>
                    <h2>В прогрессе</h2>
                </div>
                
                <div>
                    <h2>Выполненные</h2>
                </div>
                
                <div>
                    <h2>Выполненные</h2>
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
        eventBus.$on('addCard', card => {
                this.allCards.push(card)
        })
    },
    methods: {
        changeModal() {
            this.modal = !this.modal
        },
    }
})

Vue.component('card', {
    template: `
        <div>
            <h2>{{ card.task }}</h2>  
            <p>{{ card.description }}</p>
            <h4>Дата сдачи:</h4>
            <span>{{ card.deadline }}</span>
            <h4>Дата создания</h4>
            <span>{{ card.date }}</span>
        </div>
    `,
    props: {
        card: {
            type: Object
        },
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