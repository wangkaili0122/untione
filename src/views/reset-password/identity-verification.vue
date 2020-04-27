<template>
  <div>
    <verification-mode v-show="mode === 'mode'" @chooseMode="choose"></verification-mode>
    <verification-email-form v-show="mode === 'email'" @chooseMode="choose" @next="next" :userName="userName"></verification-email-form>
    <verification-phone-form v-show="mode === 'phone'" @chooseMode="choose" @next="next" :userName="userName"></verification-phone-form>
    <human-service v-show="mode === 'human'" @chooseMode="choose"></human-service>
  </div>
</template>

<script>
  import VerificationMode from './verification-mode';
  import VerificationEmailForm from './verification-email-form';
  import VerificationPhoneForm from './verification-phone-form';
  import HumanService from './human-service';
  export default {
    name: "identity-verification",
    components: {VerificationMode, VerificationEmailForm, VerificationPhoneForm, HumanService},
    props:{
      userName:{
        require:true,
        default(){
          return ''
        }
      }
    },
    data () {
      return {
        mode: 'mode'
      };
    },
    created(){

    },
    methods: {
      choose (mode) {
        this.mode = mode;
      },
      next (data) {
        this.$emit('nextStep', data);
      }
    }
  }
</script>

<style scoped>

</style>
