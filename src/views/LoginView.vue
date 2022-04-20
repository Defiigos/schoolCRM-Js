<template>
    <div class="container">
        <div class="row">
            <div class="section"></div>
            <div class="section"></div>
            <div class="section">
                <form class="card col l5 offset-l4 col s10 offset-s1">
                    <div class="card-content">
                        <div class="center-align">
                            <span class="card-title">Войдите в приложение!</span>
                        </div>
                        <div class="row">
                            <orange-input 
                                class="col s12" 
                                id="email"
                                type="email"
                                title="Email"
                                icon="account_circle"
                                v-model="v$.email.$model"
                                :validate="v$.email.$dirty"
                                :valid="
                                    (v$.email.required.$response && 
                                        v$.email.email.$response)"
                                validText="Email верен"
                                invalidText="Email не верен"
                            />
                        </div>
                        <div class="row">
                            <orange-input 
                                class="col s12" 
                                id="password"
                                type="password"
                                title="Пароль"
                                icon="key"
                                v-model="v$.password.$model"
                                :validate="v$.password.$dirty"
                                :valid="v$.password.required.$response"
                            />
                        </div>
                        <div class="row">
                            <div v-if="incorrect" class="center-align">
                                <span class="red-text" >Не верный Email или Пароль</span> 
                            </div>
                        </div>
                    </div>
                    <div class="card-action center-align">
                        <flat-orange-button :class="{'disabled': this.v$.$invalid}" icon="login" @click="login">
                            Войти
                        </flat-orange-button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import OrangeInput from '@/components/Ui/OrangeInput.vue'
import FlatOrangeButton from '@/components/Ui/FlatOrangeButton.vue'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators' 

export default {
    components: { OrangeInput, FlatOrangeButton },
    name: "LoginView",
    setup () {
        return { v$: useVuelidate() }
    },
    data: () => ({
        email: '',
        password: '',
        incorrect: false
    }),
    validations () {
        return {
            email: { required, email },
            password: { required }
        }
    },
    methods: {
        login() {
            this.$store.dispatch('AuthModule/onLogin', {
                email: this.email,
                password: this.password
            }).then(() => {
                this.$router.push('/')
            }).catch((e) => {
                M.toast({html: 'Ошибка! ' + e.response.data.message, classes: 'red-text white'})
                this.incorrect = true
            })
        }
    }
}
</script>
