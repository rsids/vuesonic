<template>
  <v-dialog
    id="dialog-login"
    :disabled="loggingIn"
    v-model="active"
    max-width="400px"
    persistent
  >
    <v-card>
      <v-card-title>Login</v-card-title>

      <v-form @submit.prevent="validateLogin">
        <v-card-text>
          <p class="caption red--text" v-if="invalidCredentials" x-cy="error">
            Invalid credentials
          </p>

          <v-text-field
            id="field-user"
            type="text"
            label="Username"
            prepend-icon="mdi-account"
            required
            v-model="form.user"
            @keyup.enter="validateLogin"
            :error-messages="userErrors"
          >
          </v-text-field>
          <v-text-field
            id="field-password"
            type="password"
            label="Password"
            v-model="form.password"
            required
            prepend-icon="mdi-lock"
            @keyup.enter="validateLogin"
            :error-messages="passwordErrors"
          >
          </v-text-field>
          <v-text-field
            id="field-server"
            type="text"
            label="Server"
            v-model="form.server"
            required
            prepend-icon="mdi-server"
            @keyup.enter="validateLogin"
            :error-messages="serverErrors"
          >
          </v-text-field>

          <!--          <v-checkbox-->
          <!--            v-model="form.saveLogin"-->
          <!--            value="1"-->
          <!--            id="field-remember-me"-->
          <!--            label="Remember me"-->
          <!--          >-->
          <!--          </v-checkbox>-->
        </v-card-text>

        <v-divider></v-divider>
        <v-progress-linear indeterminate v-if="loggingIn"></v-progress-linear>
        <div v-if="!loggingIn" style="height:4px"></div>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            id="btn-submit"
            color="primary"
            type="submit"
            text
            @click="validateLogin"
            >Login</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  name: "VSLogin",
  mixins: [validationMixin],
  props: ["active"],
  data() {
    return {
      invalidCredentials: false,
      invalidCredentialsCls: false,
      saveLogin: false,
      loggingIn: false,
      form: {
        user: null,
        server: null,
        password: null
      }
    };
  },

  validations: {
    form: {
      user: {
        required
      },
      password: {
        required,
        minLength: minLength(3)
      },
      server: {
        required
      },
      saveLogin: {}
    }
  },

  computed: {
    userErrors() {
      const errors = [];
      if (!this.$v.form.user.$dirty) {
        return errors;
      }
      !this.$v.form.user.required && errors.push("Username is required");

      return errors;
    },

    passwordErrors() {
      const errors = [];
      if (!this.$v.form.password.$dirty) {
        return errors;
      }
      !this.$v.form.password.required && errors.push("Password is required");

      return errors;
    },

    serverErrors() {
      const errors = [];
      if (!this.$v.form.server.$dirty) {
        return errors;
      }
      !this.$v.form.server.required && errors.push("Server is required");
      // !this.$v.form.server.url && errors.push("Invalid server url")

      return errors;
    }
  },

  methods: {
    ...mapActions("connection", ["storeCredentials", "clearCredentials"]),
    ...mapActions("user", ["getUser"]),

    doLogin() {
      if (this.loggingIn) {
        return;
      }
      this.loggingIn = true;
      this.storeCredentials(this.form);
      this.getUser(this.form).then(
        () => {
          // this.getUser().then(() => {
          //   this.$router.replace("/");
          // });
        },
        () => {
          this.clearCredentials();
          this.loggingIn = false;
          this.invalidCredentials = true;
          this.invalidCredentialsCls = true;
          setTimeout(() => {
            this.invalidCredentialsCls = false;
          }, 300);
        }
      );
    },

    validateLogin() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.doLogin();
      }
    }
  }
};
</script>

<style scoped></style>
