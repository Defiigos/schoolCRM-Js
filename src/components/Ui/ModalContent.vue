<template>
    <div class="container">
        <div class="section center-align">
            <h4>{{title}}</h4>
        </div>
        <div class="divider"></div>
        <div class="section hide-on-small-only"></div>
        <div class="section">
            <div class="row" v-for="input in inputs" :key="input.id">
                <template v-if="input.target === 'status'">
                    <orange-select
                        class="col l4 offset-l4 m8 s10"
                        :name="`${refs} select`"
                        :label="input.title"
                        :options="statuses"
                        :optionLabel="input.title"
                        v-model="inputsValue[input.target]"
                    />
                </template>
                <template v-else-if="input.target === 'roles'">
                    <orange-select
                        class="col l4 offset-l4 m8 s10"
                        :name="`${refs} select`"
                        :label="input.title"
                        :options="roles"
                        :optionLabel="input.title"
                        v-model="inputsValue[input.target]"
                    />
                </template>
                <template v-else-if="input.target === 'active'">
                    <orange-select
                        class="col l4 offset-l4 m8 s10"
                        :name="`${refs} select`"
                        :label="input.title"
                        :options="actives"
                        :optionLabel="input.title"
                        v-model="inputsValue[input.target]"
                    />
                </template>
                <template v-else-if="input.target === 'amountDto'">
                    <orange-select
                        class="col l4 offset-l4 m8 s10"
                        :name="`${refs} select`"
                        :label="input.title"
                        :options="amounts"
                        :optionLabel="input.title"
                        v-model="inputsValue[input.target]"
                    />
                </template>
                <template v-else-if="input.target === 'lessonDuration'">
                    <orange-select
                        class="col l4 offset-l4 m8 s10"
                        :name="`${refs} select`"
                        :label="input.title"
                        :options="lessonDurations"
                        :optionLabel="input.title"
                        v-model="inputsValue[input.target]"
                    />
                </template>
                <template v-else-if="input.target === 'location'">
                    <orange-select
                        class="col l4 offset-l4 m8 s10"
                        :name="`${refs} select`"
                        :label="input.title"
                        :options="locations"
                        :optionLabel="input.title"
                        v-model="inputsValue[input.target]"
                    />
                </template>
                <template v-else-if="input.target === 'teacher'">
                    <orange-select
                        class="col l4 offset-l4 m8 s10"
                        :name="`${refs} select`"
                        :label="input.title"
                        :options="teachers"
                        :optionLabel="input.title"
                        v-model="inputsValue[input.target]"
                    />
                </template>
                <template v-else-if="input.target === 'lessonGroup'">
                    <orange-select
                        class="col l4 offset-l4 m8 s10"
                        :name="`${refs} select`"
                        :label="input.title"
                        :options="lessonGroups"
                        :optionLabel="input.title"
                        v-model="inputsValue[input.target]"
                    />
                </template>
                <template v-else-if="input.target === 'paymentAmount'">
                    <orange-select
                        class="col l4 offset-l4 m8 s10"
                        :name="`${refs} select`"
                        :label="input.title"
                        :options="paymentAmounts"
                        :optionLabel="input.title"
                        v-model="inputsValue[input.target]"
                    />
                </template>
                <template v-else-if="input.target === 'students'">
                    <multiple-orange-select
                        class="col l4 offset-l4 m8 s10"
                        :name="`${refs} select`"
                        :label="input.title"
                        :options="students"
                        :optionLabel="input.title"
                        v-model="inputsValue[input.target]"
                    />
                </template>
                <template v-else>
                    <orange-input 
                        class="col l4 offset-l4 m8 s10" 
                        :id="input.id"
                        :type="input.type"
                        :title="input.title"
                        v-model="inputsValue[input.target]"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import MultipleOrangeSelect from './MultipleOrangeSelect.vue'
import OrangeInput from './OrangeInput.vue'
import OrangeSelect from './OrangeSelect.vue'

export default {
  components: { OrangeInput, OrangeSelect, MultipleOrangeSelect },
    name: "modal-content",
    props: {
        title: {
            type: String,
            default: 'Модальное окно'
        },
        refs: {
            type: String,
            required: true
        },
        inputs: {
            type: Array,
            required: true
        },
        statuses: {
            type: Array,
            required: false
        },
        roles: {
            type: Array,
            required: false
        },
        actives: {
            type: Array,
            required: false
        },
        students: {
            type: Array,
            required: false
        },
        amounts: {
            type: Array,
            required: false
        },
        lessonDurations: {
            type: Array,
            required: false
        },
        locations: {
            type: Array,
            required: false
        },
        lessonGroups: {
            type: Array,
            required: false
        },
        paymentAmounts: {
            type: Array,
            required: false
        },
        teachers: {
            type: Array,
            required: false
        },
        isOpen: {
            type: Boolean,
            required: true
        },
        modelValue: [String]
    },
    data: () => ({
        inputsValue: {}
    }),
    watch: {
        modelValue() {
            if (this.modelValue == '') {
                this.inputsValue = {}
                return
            }

            if(!this.isOpen) {
                const values = []
                const inputs = this.modelValue.split('&')
                inputs.forEach((input) => {
                    values.push({
                        type: input.substring(input.indexOf('?')+1, input.indexOf('=')),
                        data: input.substring(input.indexOf('=')+1)
                    })
                })

                this.inputsValue = {}
                values.forEach((value) => {
                    this.inputsValue[value.type] = value.data
                })
            }
        },

        inputsValue: {
            handler(obj) {
                const rawObj = Object.assign({}, obj)
                let filter = ''
                let fieldCount = 0

                for (var key in rawObj) {
                    if (rawObj[key] !== '') {
                        if (fieldCount == 0)
                            filter = "?" + key + "=" + rawObj[key]
                        else
                            filter = filter + "&" + key + "=" + rawObj[key]
                        fieldCount++
                    }
                }
                this.$emit('update:modelValue', filter)
            },
            deep: true
        },
        isOpen() {
            // КОСТЫЛЬ, НЕ ЗНАЮ КАК СДЕЛАТЬ ВЫБОР НУЖНОГО ЭЛЕМЕНТА В SELECT'Е
            if (this.isOpen) {
                for (let i = 0; i < document.getElementsByName(`${this.refs} select`).length; i++) {
                    document.getElementsByName(`${this.refs} select`)[i].getElementsByTagName('input')[0].click()
                }
                document.getElementsByTagName('input')[0].click()
            }
        }
    }
}
</script>