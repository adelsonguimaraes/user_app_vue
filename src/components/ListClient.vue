<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const clients = ref([]);
const router = useRouter();
const userStore = useUserStore();

const dialogVisible = ref(false);
const clientToDelete = ref(null);


onMounted(async () => {
  try {
    await userStore.getUsers();
    clients.value = userStore.users;
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
});


function openConfirmationDialog(client) {
  clientToDelete.value = client;
  dialogVisible.value = true;
}


function cancelDelete() {
  dialogVisible.value = false;
}


async function deleteClient() {
  try {

    await userStore.deleteUser(clientToDelete.value.id);

    clients.value = clients.value.filter(client => client.id !== clientToDelete.value.id);

    dialogVisible.value = false;
  } catch (error) {
    console.error("Error deleting client:", error);
  }
}


function addUser() {
  router.push({ name: "FormClient" });
}
</script>

<template>
  <v-alert
    v-if="clients.length === 0"
    title="Nenhum usuário cadastrado, clique no botão abaixo para adicionar um novo."
    type="info"
  >
  </v-alert>

  <v-dialog v-model="dialogVisible" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Deseja realmente remover?</span>
      </v-card-title>
      <v-card-actions>
        <v-btn color="primary" @click="deleteClient">Sim</v-btn>
        <v-btn color="secondary" @click="cancelDelete">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-container>
    <v-row>
      <v-col v-for="(client, index) in clients" :key="index" cols="12" sm="4">
        <v-card class="mx-auto" max-width="400">
          <v-card-title>{{ client.name }}</v-card-title>

          <v-card-text>
            <div>Email: {{ client.email }}</div>
            <div>CPF: {{ client.cpf }}</div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              prepend-icon="mdi-delete"
              color="error"
              @click="openConfirmationDialog(client)"
            >
              Deletar
            </v-btn>

            <v-btn
              prepend-icon="mdi-pencil"
              color="primary"
              @click="router.push({ name: 'FormClient', params: { id: client.id } })"
            >
              Editar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>


  <v-btn
    fab
    color="primary"
    class="ma-2"
    style="position: fixed; right: 15px; bottom: 20px"
    @click="addUser"
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>
