<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <b-alert
          :show="dismissCountDown"
          dismissible
          :variant="alert.color"
          @dismissed="dismissCountDown=0"
          @dismiss-count-down="countDownChanged"
        >{{ alert.text }}</b-alert>
      </div>
    </div>
    <div class="row">
      <div class="col-9">
        <h3 class="my-4">Listado de Notas</h3>
        <table class="table">
          <thead class=".thead-light">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Descripcion</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in notas" :key="index">
              <td class="text-left">{{ item.nombre }}</td>
              <td class="text-left">{{ item.descripcion }}</td>
              <td>
                <b-icon icon="trash-fill" variant="danger" @click="removeNota(item._id)"></b-icon>
                <b-icon icon="pencil" variant="info" @click="availableForm(item)"></b-icon>
                <b-icon icon="search" variant="primary"></b-icon>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-3">
        <div class="row">
          <div class="col">
            <a
              href="#"
              class="btn btn-primary my-4"
              @click="availableForm()"
              v-if="modCreate"
            >Nueva nota</a>
            <a href="#" class="btn btn-warning my-4" v-else>Editar nota</a>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <form @submit.prevent="sendForm(formData)">
              <fieldset id="formData" disabled>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control my-3"
                    v-model="formData.nombre"
                    placeholder="Nombre"
                  />
                </div>
                <div class="form-group">
                  <textarea
                    type="text"
                    class="form-control my-3"
                    placeholder="Description"
                    v-model="formData.descripcion"
                    rows="5"
                  ></textarea>
                </div>
                <div class="form-group" v-if="modCreate">
                  <input class="form-check-input" type="checkbox" value id="createOtherNota" />
                  <label class="form-check-label" for="createOtherNota">Crear otra nota</label>
                </div>
                <b-button
                  class="btn-danger my-3 mx-2"
                  v-if="!modCreate"
                  @click="availableForm()"
                >Cancelar</b-button>
                <b-button type="submit" class="btn-success my-3">Enviar</b-button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notas: [],
      dismissSecs: 5,
      modCreate: true,
      dismissCountDown: 0,
      alert: { color: "", text: "" },
      formData: { id: "", nombre: "", descripcion: "" }
    };
  },
  created() {
    this.getAllNotas();
  },
  methods: {
    availableForm(record = false) {
      this.modCreate = !record;
      document.getElementById("formData").disabled = false;

      this.formData.id = "";
      this.formData.nombre = "";
      this.formData.descripcion = "";

      if (record) {
        this.formData.id = record._id;
        this.formData.nombre = record.nombre;
        this.formData.descripcion = record.descripcion;
      }
    },
    showAlert(type = "danger", text = "") {
      this.alert.color = type;
      this.alert.text = text;
      this.activateAlert();
    },
    getAllNotas() {
      this.axios
        .get("/notas")
        .then(res => {
          this.notas = res.data.notas;
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    sendForm(formData = null) {
      if (this.formData.nombre.length == 0) {
        this.showAlert("danger", "El nombre es requerido.");
        return false;
      }
      if (this.modCreate) {
        return this.createNota();
      }
      return this.editNota(formData);
    },
    createNota() {
      if (this.formData.nombre.length == 0) {
        this.showAlert("danger", "No podemos crear una nota sin nombre.");
        return false;
      }
      this.axios
        .post("/nota", this.formData)
        .then(res => {
          this.notas.push(res.data.nota);
          this.formData.nombre = "";
          this.formData.descripcion = "";

          if (!document.getElementById("createOtherNota").checked) {
            document.getElementById("formData").disabled = true;
          }

          this.showAlert("success", "Nota creada con exito !!!");
        })
        .catch(e => {
          const messageError = e.response.data.err._message
            ? e.response.data.err._message
            : "No se ha podido crear la nota!!!";
          this.showAlert("danger", messageError);
        });
    },
    removeNota(_id) {
      this.axios
        .delete(`/nota/${_id}`)
        .then(res => {
          const index = this.notas.findIndex(
            item => item._id === res.data.nota._id
          );
          this.notas.splice(index, 1);

          this.showAlert("success", "Nota eliminada !!!");
        })
        .catch(e => {
          const messageError = e.response.data.err._message
            ? e.response.data.err._message
            : "Disculpa, tenemos problemas borrando esta nota!!!";
          this.showAlert("danger", messageError);
        });
    },
    editNota(record) {
      this.axios
        .put(`/nota/${record.id}`, record)
        .then(res => {
          const index = this.notas.findIndex(
            item => item._id === res.data.nota._id
          );

          this.notas[index].nombre = res.data.nota.nombre;
          this.notas[index].descripcion = res.data.nota.descripcion;

          this.availableForm();

          this.showAlert("success", "Nota editada !!!");
        })
        .catch(e => {
          const messageError = e.response.data.err._message
            ? e.response.data.err._message
            : "Disculpa, tenemos problemas editando esta nota!!!";
          this.showAlert("danger", messageError);
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    activateAlert() {
      this.dismissCountDown = this.dismissSecs;
    }
  }
};
</script>