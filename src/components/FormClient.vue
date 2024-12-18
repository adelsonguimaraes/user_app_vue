<template>
  <v-alert
    v-if="!!state.serverError"
    closable
    title="Atenção"
    type="error"
    @click:close="state.serverError = ''"
    >{{ state.serverError }}
  </v-alert>

  <form>
    <v-text-field
      v-model="state.name"
      :counter="10"
      :error-messages="v$.name.$errors.map((e) => e.$message)"
      label="Name"
      required
      @blur="v$.name.$touch"
      @input="v$.name.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.email"
      :error-messages="v$.email.$errors.map((e) => e.$message)"
      label="E-mail"
      required
      @blur="v$.email.$touch"
      @input="v$.email.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.cpf"
      :error-messages="v$.cpf.$errors.map((e) => e.$message)"
      label="CPF"
      counter="11"
      required
      @blur="v$.cpf.$touch"
      @input="v$.cpf.$touch"
      type="number"
    ></v-text-field>

    <v-btn class="me-4" @click="save"> Salvar </v-btn>
    <v-btn @click="goToListPage"> Voltar </v-btn>
  </form>
</template>

<script setup>
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required, numeric, minLength, maxLength } from "@vuelidate/validators";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();
const userStore = useUserStore();

const initialState = {
  name: "",
  email: "",
  cpf: "",
};

const state = reactive({
  ...initialState,
  serverError: "",
});

const rules = {
  name: { required },
  email: { required, email },
  cpf: { required, numeric, minLength: 11, maxLength: 11 },
};

const v$ = useVuelidate(rules, state);

onMounted(async () => {
  if (router.currentRoute.value.params.id) {
    try {
      const user = await userStore.getUser(router.currentRoute.value.params.id);
      state.name = user.name;
      state.email = user.email;
      state.cpf = user.cpf;
    } catch (error) {
      console.error("Erro ao buscar usuario:", error);
    }
  }
});

function save() {
  v$.value.$validate().then(async (isValid) => {
    if (isValid) {
      try {
        if (router.currentRoute.value.params.id) {
          await userStore.updateUser(state, router.currentRoute.value.params.id);
        } else {
          await userStore.addUser(state);
        }

        clear();
        goToListPage();
      } catch (error) {
        if (error.response && error.response.data.error) {
          const backendError = error.response.data.error;

          if (backendError === "invalid_cpf") {
            state.serverError = "O CPF informado é inválido.";
          }
        }
      }
    }
  });
}

function clear() {
  v$.value.$reset();

  for (const [key, value] of Object.entries(initialState)) {
    state[key] = value;
  }
}

function goToListPage() {
  router.push({ name: "ListClient" });
}

</script>

