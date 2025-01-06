<script setup lang="ts">
import { showSweetAlert } from "~/utils/showSweetAlert";

definePageMeta({
  layout: false,
});

const text = ref<any>("Sort By");
const data = [
  {
    id: "From A-Z",
    name: "From A-Z",
  },
  {
    id: "From Z-A",
    name: "From Z-A",
  },
];

function closeDropdown() {
  const button = document.querySelector(`.select.action`) as HTMLElement;

  button.classList.remove("action");
  button.style.display = "none";
}

function handleData(data: any) {
  text.value = data;
  closeDropdown();
}

function showDropdown() {
  const button = document.querySelector(`.select`) as HTMLElement;
  if (!button.classList.contains("action")) {
    button.classList.add("action");
    button.style.display = "block";
  } else {
    closeDropdown();
  }
}

const showAlertSuccess = () => {
  showSweetAlert("Success msg", "success", 8000, true, "top-end");
};

const showAlertError = () => {
  showSweetAlert("Error msg", "error", 0, true, "top-left");
};

const showAlertInfo = () => {
  showSweetAlert("Save que", "info", 1000, false, "bottom-end");
};
</script>
<template>
  <div class="body">
    <!-- 
      /*********************************************/
                          Font
      /*********************************************/
    -->

    <div class="row font">
      <div class="col-4">
        <p class="top">Eng Font : Be Vietnam Pro</p>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
        <p class="subtitle-1">Subtitle 1</p>
        <p class="subtitle-2">Subtitle 2</p>
        <p class="body-1">Body 1</p>
        <p class="body-2">Body 2</p>
        <p class="body-3">Body 3</p>
        <p class="button-1">Button 1</p>
        <p class="button-2">Button 2</p>
      </div>
      <div class="col-4">
        <p class="top">Thai Font : Sukhumvit set</p>
        <h1>หัวข้อ 1</h1>
        <h2>หัวข้อ 2</h2>
        <h3>หัวข้อ 3</h3>
        <h4>หัวข้อ 4</h4>
        <h5>หัวข้อ 5</h5>
        <h6>หัวข้อ 6</h6>
        <p class="subtitle-1">หัวข้อรอง 1</p>
        <p class="subtitle-2">หัวข้อรอง 2</p>
        <p class="body-1">เนื้อหา 1</p>
        <p class="body-2">เนื้อหา 2</p>
        <p class="body-3">เนื้อหา 3</p>
        <p class="button-1">ปุ่มกด 1</p>
        <p class="button-2">ปุ่มกด 2</p>
      </div>
      <div class="col-4">
        <p class="top">Ex : @include h1</p>
        <h1>h1</h1>
        <h2>h2</h2>
        <h3>h3</h3>
        <h4>h4</h4>
        <h5>h5</h5>
        <h6>h6</h6>
        <p class="subtitle-1">font-subtitle-1</p>
        <p class="subtitle-2">font-subtitle-2</p>
        <p class="body-1">font-body-1</p>
        <p class="body-2">font-body-2</p>
        <p class="body-3">font-body-3</p>
        <p class="button-1">font-button-1</p>
        <p class="button-2">font-button-2</p>
      </div>
    </div>
    <!--
      /*********************************************/
                          color
      /*********************************************/
    -->
    <div class="row">
      <p class="top">Colors</p>
      <div class="card-color-p">
        <div>
          <div class="card-color black"></div>
          <p>#000</p>
          <p>$black</p>
        </div>
        <div>
          <div class="card-color blue"></div>
          <p>#51a1ff</p>
          <p>$blue</p>
        </div>
        <div>
          <div class="card-color violet-red"></div>
          <p>#cf20a9</p>
          <p>$violet-red</p>
        </div>
        <div>
          <div class="card-color royal-blue"></div>
          <p>#3372dd</p>
          <p>$royal-blue</p>
        </div>
        <div>
          <div class="card-color pale-magenta"></div>
          <p>#cf20a9</p>
          <p>$pale-magenta</p>
        </div>
        <div>
          <div class="card-color purple-heart"></div>
          <p>#5808bf</p>
          <p>$purple-heart</p>
        </div>
        <div>
          <div class="card-color lilac"></div>
          <p>#d79aca</p>
          <p>$lilac</p>
        </div>
        <div>
          <div class="card-color white"></div>
          <p>#ffffff</p>
          <p>$white</p>
        </div>
        <div>
          <div class="card-color mauve"></div>
          <p>#d2afff</p>
          <p>$mauve</p>
        </div>
        <div>
          <div class="card-color silver"></div>
          <p>#c4c4c4</p>
          <p>$silver</p>
        </div>
        <div>
          <div class="card-color medium-purple"></div>
          <p>#b27cff</p>
          <p>$medium-purple</p>
        </div>
        <div>
          <div class="card-color perano"></div>
          <p>#a4b7ff</p>
          <p>$perano</p>
        </div>
        <div>
          <div class="card-color pastel-blue"></div>
          <p>#6d8dff</p>
          <p>$pastel-blue</p>
        </div>
        <div>
          <div class="card-color cornflower-blue"></div>
          <p>#6ea8ff</p>
          <p>$cornflower-blue</p>
        </div>
        <div>
          <div class="card-color glowing-purple"></div>
          <p>#7029ba</p>
          <p>$glowing-purple</p>
        </div>
        <div>
          <div class="card-color red-violet"></div>
          <p>#af2992</p>
          <p>$red-violet</p>
        </div>
        <div>
          <div class="card-color salmon"></div>
          <p>#ff7d6b</p>
          <p>$salmon</p>
        </div>
        <div>
          <div class="card-color electric-indigo"></div>
          <p>#5700ff</p>
          <p>$electric-indigo</p>
        </div>
        <div>
          <div class="card-color blue-violet"></div>
          <p>#9747ff</p>
          <p>$blue-violet</p>
        </div>
        <div>
          <div class="card-color seance"></div>
          <p>#5b2364</p>
          <p>$seance</p>
        </div>
        <div>
          <div class="card-color lightning-yellow"></div>
          <p>#ffa438</p>
          <p>$lightning-yellow</p>
        </div>
        <div>
          <div class="card-color victoria"></div>
          <p>#53467e</p>
          <p>$victoria</p>
        </div>
        <div>
          <div class="card-color christalle"></div>
          <p>#311864</p>
          <p>$christalle</p>
        </div>
        <div>
          <div class="card-color purple"></div>
          <p>#8b63e1</p>
          <p>$purple</p>
        </div>
        <div>
          <div class="card-color white-dove"></div>
          <p>#ececec4d</p>
          <p>$white-dove</p>
        </div>
        <div>
          <div class="card-color violet-blue"></div>
          <p>#7026ff</p>
          <p>$violet-blue</p>
        </div>
        <div>
          <div class="card-color black-russian"></div>
          <p>#030a1a</p>
          <p>$black-russian</p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="card-color-s">
        <div>
          <div class="card-color bunker"></div>
          <p>#2a2b2c</p>
          <p>$bunker</p>
        </div>
        <div>
          <div class="card-color nero"></div>
          <p>#1c1c1c</p>
          <p>$nero</p>
        </div>
        <div>
          <div class="card-color cloud-burst"></div>
          <p>#363b48</p>
          <p>$cloud-burst</p>
        </div>
        <div>
          <div class="card-color eclipse"></div>
          <p>#3c3c3c</p>
          <p>$eclipse</p>
        </div>
        <div>
          <div class="card-color tuna"></div>
          <p>#474d5b</p>
          <p>$tuna</p>
        </div>
        <div>
          <div class="card-color moon-raker"></div>
          <p>#bbaccb</p>
          <p>$moon-raker</p>
        </div>
        <div>
          <div class="card-color gainsboro"></div>
          <p>#d9d9d9</p>
          <p>$gainsboro</p>
        </div>
        <div>
          <div class="card-color snow"></div>
          <p>#f9f9f9</p>
          <p>$snow</p>
        </div>
        <div>
          <div class="card-color red"></div>
          <p>#f00</p>
          <p>$red</p>
        </div>
        <div>
          <div class="card-color orange"></div>
          <p>#e68a00</p>
          <p>$orange</p>
        </div>
        <div>
          <div class="card-color green"></div>
          <p>#2ca203</p>
          <p>$green</p>
        </div>
        <div>
          <div class="card-color myrtle"></div>
          <p>#1b4f00</p>
          <p>$myrtle</p>
        </div>
        <div>
          <div class="card-color light-red"></div>
          <p>#ffcaca</p>
          <p>$light-red</p>
        </div>
        <div>
          <div class="card-color light-yellow"></div>
          <p>#fff0bb</p>
          <p>$light-yellow</p>
        </div>
        <div>
          <div class="card-color light-green"></div>
          <p>#b1ffd1</p>
          <p>$light-green</p>
        </div>
        <div>
          <div class="card-color dark-purple"></div>
          <p>#170736</p>
          <p>$dark-purple</p>
        </div>
        <div>
          <div class="card-color conifer"></div>
          <p>#b9de68</p>
          <p>$conifer</p>
        </div>
        <div>
          <div class="card-color raw-umber"></div>
          <p>#733500</p>
          <p>$raw-umber</p>
        </div>
        <div>
          <div class="card-color kournikova"></div>
          <p>#fdcb5d</p>
          <p>$kournikova</p>
        </div>
        <div>
          <div class="card-color sapphire"></div>
          <p>#002d7d</p>
          <p>$sapphire</p>
        </div>
        <div>
          <div class="card-color light-blue"></div>
          <p>#a8ecff</p>
          <p>$light-blue</p>
        </div>
        <div>
          <div class="card-color black-hover"></div>
          <p>#00000033</p>
          <p>$black-hover</p>
        </div>
        <div>
          <div class="card-color sea"></div>
          <p>#00a0c2</p>
          <p>$sea</p>
        </div>
      </div>
    </div>
    <!--
      /*********************************************/
                          Button
      /*********************************************/
    -->
    <div class="row" style="background-color: #000">
      <p class="top">Button</p>

      <div class="col-4">
        <button class="btn btn-outline-primary">
          <img src="assets/images/icons/album-s.png" alt="Image" />
          btn-outline-primary
        </button>
        <div class="box" style="background-color: white">
          <span
            ><span>&lt;</span>button<span>
              class<span>="btn btn-outline-primary"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;
          <span
            ><span>&lt;</span>img<span> src<span>="icon.png"</span>/</span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp; Button
          <br />
          <span><span>&lt;</span>/button<span>&gt;</span></span>
        </div>
      </div>
      <div class="col-4">
        <button class="btn btn-outline-primary">
          btn-outline-primary
          <img src="assets/images/icons/album-s.png" alt="Image" />
        </button>
        <div class="box" style="background-color: white">
          <span
            ><span>&lt;</span>button<span>
              class<span>="btn btn-outline-primary"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp; Button
          <br />
          &nbsp; &nbsp;
          <span
            ><span>&lt;</span>img<span> src<span>="icon.png"</span>/</span
            ><span>&gt;</span></span
          >
          <br />
          <span><span>&lt;</span>/button<span>&gt;</span></span>
        </div>
      </div>
      <div class="col-4">
        <button class="btn btn-solid-primary">
          <span>btn-solid-primary</span>
        </button>
        <div class="box" style="background-color: white">
          <span
            ><span>&lt;</span>button<span>
              class<span>="btn btn-outline-primary"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;
          <span>&lt;</span>span<span>&gt;</span> Button
          <span>&lt;</span>/span<span>&gt;</span>
          <br />
          <span><span>&lt;</span>/button<span>&gt;</span></span>
        </div>
      </div>
      <div class="col-12">
        <div class="card-button">
          <div>
            <button class="btn btn-outline-secondary">
              btn-outline-secondary
            </button>
          </div>
          <div>
            <button class="btn-outline-third">btn-outline-third</button>
          </div>
        </div>
        <div class="box" style="background-color: white">
          <span
            ><span>&lt;</span>button<span>
              class<span>="btn btn-outline-secondary"</span> </span
            ><span>&gt;</span></span
          >
          Button
          <span><span>&lt;</span>/button<span>&gt;</span></span>
          <br />
          <span
            ><span>&lt;</span>button<span>
              class<span>="btn btn-outline-third"</span> </span
            ><span>&gt;</span></span
          >
          Button
          <span><span>&lt;</span>/button<span>&gt;</span></span>
        </div>
      </div>

      <div class="col-12">
        <button class="btn btn-view-all">ดูเพิ่มเติม</button>
        <div class="box" style="background-color: white">
          <span
            ><span>&lt;</span>button<span>
              class<span>="btn btn-view-all"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp; ดูเพิ่มเติม
          <br />
          <span><span>&lt;</span>/button<span>&gt;</span></span>
        </div>
      </div>
    </div>
    <!--
      /*********************************************/
                          Text Input
      /*********************************************/
    -->
    <div class="row card-input mt-5">
      <p class="top">Text Fields</p>
      <div class="col-6">
        <input class="form-control" type="text" placeholder="Text" />
        <div class="highlight">
          <span
            ><span>&lt;</span>input<span>
              class<span>="form-control"</span> type<span>="text"</span>/</span
            ><span>&gt;</span></span
          >
        </div>
      </div>
      <div class="col-6">
        <div class="input-group" style="margin-top: 0px">
          <input class="form-control" type="text" placeholder="Text" />
          <span class="input-group-text">
            <img src="assets/images/icons/album-s.png" alt="Image" />
          </span>
        </div>
        <div class="highlight">
          <span
            ><span>&lt;</span>div<span> class<span>="input-group"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;
          <span
            ><span>&lt;</span>input<span>
              class<span>="form-control"</span> type<span>="text"</span> /</span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;
          <span
            ><span>&lt;</span>span<span>
              class<span>="input-group-text"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <span
            ><span>&lt;</span>img<span>
              src<span>="assets/images/icons/search.svg"</span>
              class<span>="icon"</span>/</span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;
          <span><span>&lt;</span>/span<span> </span><span>&gt;</span></span>
          <br />
          <span><span>&lt;</span>/div<span> </span><span>&gt;</span></span>
        </div>
      </div>
      <div class="col-6 mt-5">
        <input
          class="form-control-rounded-normal"
          type="text"
          placeholder="Text"
        />
        <div class="highlight">
          <span
            ><span>&lt;</span>input<span>
              class<span>="form-control-rounded-normal"</span>
              type<span>="text"</span>/</span
            ><span>&gt;</span></span
          >
        </div>
      </div>
      <div class="col-6 mt-5">
        <div class="input-group" style="margin-top: 0px">
          <span class="input-group-text">
            <img src="assets/images/icons/album-s.png" alt="Image" />
          </span>
          <input class="form-control" type="text" placeholder="Text" />
        </div>
        <div class="highlight">
          <span
            ><span>&lt;</span>div<span> class<span>="input-group"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;
          <span
            ><span>&lt;</span>span<span>
              class<span>="input-group-text"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <span
            ><span>&lt;</span>img<span>
              src<span>="assets/images/icons/search.svg"</span>
              class<span>="icon"</span>/</span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;
          <span><span>&lt;</span>/span<span> </span><span>&gt;</span></span>
          <br />
          &nbsp; &nbsp;
          <span
            ><span>&lt;</span>input<span>
              class<span>="form-control"</span> type<span>="text"</span> /</span
            ><span>&gt;</span></span
          >
          <br />

          <span><span>&lt;</span>/div<span> </span><span>&gt;</span></span>
        </div>
      </div>
      <div class="col-6 mt-5">
        <div class="input-group-rounded">
          <input
            class="form-control rounded-normal"
            type="text"
            placeholder="Text"
          />
          <span class="input-group-text">
            <img src="assets/images/icons/album-s.png" alt="Image" />
          </span>
        </div>
        <div class="highlight">
          <span
            ><span>&lt;</span>div<span>
              class<span>="input-group-rounded"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;
          <span
            ><span>&lt;</span>input<span>
              class<span>="form-control rounded-normal"</span> type<span
                >="text"</span
              >
              /</span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;
          <span
            ><span>&lt;</span>span<span>
              class<span>="input-group-text"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <span
            ><span>&lt;</span>img<span>
              src<span>="assets/images/icons/search.svg"</span>
              class<span>="icon"</span>/</span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;
          <span><span>&lt;</span>/span<span> </span><span>&gt;</span></span>
          <br />
          <span><span>&lt;</span>/div<span> </span><span>&gt;</span></span>
        </div>
      </div>
      <div class="col-6 mt-5">
        <input
          class="form-control-rounded-normal has-error"
          type="text"
          value="Error"
        />
        <p class="has-error-feedback">Status Error</p>
        <div class="highlight">
          <span
            ><span>&lt;</span>input<span>
              class<span>="form-control-rounded-normal has-error"</span>
              type<span>="text"</span>/</span
            >
            <span>&gt;</span></span
          >
          <br />
          <span
            ><span>&lt;</span>p<span>
              class<span>="has-error-feedback"</span> &gt;</span
            ></span
          >
          Status Error
          <span><span>&lt;</span>/p<span> &gt;</span></span>
        </div>
      </div>
    </div>

    <!--
      /*********************************************/
                          Dropdown
      /*********************************************/
    -->
    <div class="row card-input mt-5">
      <p class="top">Dropdown</p>
      <div class="col-4">
        <div class="input-select">
          <div class="form-control">
            <p>Sort By</p>
            <span class="icon-prefix">
              <img src="assets/images/icons/drop-down.png" alt="Image" />
            </span>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="input-select">
          <div class="form-control">
            <p>Sort By</p>
            <span class="icon-prefix">
              <img src="assets/images/icons/drop-down.png" alt="Image" />
            </span>
          </div>
          <div class="dropdown-select" style="display: flex">
            <div class="dropdown-content">
              <label class="content"> From A-Z </label>
            </div>
            <div class="dropdown-content">
              <label class="content"> From Z-A </label>
            </div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="input-select">
          <div class="form-control" @click="showDropdown()">
            <p>{{ text }}</p>
            <span class="icon-prefix">
              <img src="assets/images/icons/drop-down.png" alt="Image" />
            </span>
          </div>
          <div class="dropdown-select select">
            <div
              v-for="(option, index) in data"
              :key="index"
              class="dropdown-content"
            >
              <label class="content" @click="handleData(option.id)">
                {{ option.name }}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 mt-10">
        <div class="box" style="background-color: white">
          <span><span>&lt;</span>script<span></span><span>&gt;</span></span>
          <br />
          const text = ref<span>&lt;</span>any<span>&gt;</span>("Sort By");
          <br />
          const data = [ { id: "From A-Z", name: "From A-Z", }, { id: "From
          Z-A", name: "From Z-A", } ];
          <br />
          <br />

          function closeDropdown(val:string) {
          <br />
          &nbsp; &nbsp; const button = document.querySelector(`.${val}.action`)
          as HTMLElement;
          <br />
          &nbsp; &nbsp; if(button){
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp; button.classList.remove("action");
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp; button.style.display = "none";
          <br />
          &nbsp; &nbsp; }
          <br />
          }
          <br /><br />
          function showDropdown(val:string) {
          <br />
          const button = document.querySelector(`.${val}`) as HTMLElement;
          <br />
          &nbsp; &nbsp;if(!button.classList.contains("action")) { <br />
          &nbsp; &nbsp;&nbsp; &nbsp;button.classList.add("action");
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp;button.style.display = "block";
          <br />
          &nbsp; &nbsp;} else {
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp; closeDropdown(val);
          <br />
          &nbsp; &nbsp;}
          <br />
          }
          <br />
          <br />
          function handleData(data: any, val:string) {
          <br />
          &nbsp; &nbsp; text.value = data;
          <br />
          &nbsp; &nbsp; closeDropdown(val);
          <br />
          }

          <br />
          ....
          <br />
          <span><span>&lt;</span>/script<span></span><span>&gt;</span></span>
          <br />
          <span
            ><span>&lt;</span>div<span> class<span>="input-select"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;
          <span
            ><span>&lt;</span>div<span>
              class<span>="form-control"</span> @click<span
                >="showDropdown('select')"</span
              ></span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <span><span>&lt;</span>p</span><span>&gt;</span><span>{</span
          ><span>{text}</span><span>}</span><span>&lt;</span
          ><span>p<span>&gt;</span></span>
          <br />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <span
            ><span>&lt;</span>span<span> class<span>="icon-prefix"</span></span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
          <span
            ><span>&lt;</span>img<span>
              src<span>="assets/images/icons/drop-down.png"</span>/</span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp; &nbsp; &nbsp;
          <span><span>&lt;</span>/span<span> </span><span>&gt;</span></span>
          <br />
          &nbsp; &nbsp;
          <span><span>&lt;</span>/div<span>&gt;</span></span>
          <br />
          &nbsp; &nbsp;
          <span
            ><span>&lt;</span>div<span>
              class<span>="dropdown-select select"</span> </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp;
          <span
            ><span>&lt;</span>div<span>
              v-for<span
                >="(option, index) in data" :key="index"
                class="dropdown-content"</span
              > </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <span
            ><span>&lt;</span>label<span>
              class<span
                >="content" @click="handleData(option.id,'select')"</span
              > </span
            ><span>&gt;</span></span
          >
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;<span>{</span>
          <span>{option.name}</span><span>}</span>
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <span><span>&lt;</span>/label<span>&gt;</span></span>
          <br />
          &nbsp; &nbsp;&nbsp; &nbsp;
          <span><span>&lt;</span>/div<span>&gt;</span></span>
          <br />
          &nbsp; &nbsp;
          <span><span>&lt;</span>/div<span>&gt;</span></span>
          <br />
          <span><span>&lt;</span>/div<span>&gt;</span></span>
        </div>
      </div>
    </div>

    <!--
      /*********************************************/
                          Alerts
      /*********************************************/
    -->
    <div class="row">
      <p class="top">Alerts</p>
      <div class="col-6">
        <button type="button" class="btn btn-success" @click="showAlertSuccess">
          click success
        </button>
        <div class="box">
          <span><span>&lt;</span>script<span></span><span>&gt;</span></span>
          <br />
          import { showSweetAlert } from "~/shared/utils/alert";
          <br />
          <br />
          const showAlert = () => {
          <br />
          showSweetAlert("Created Success", "success", 1000, true, "top-start");
          <br />
          }
          <br />
          ....
          <br />
          <span><span>&lt;</span>/script<span></span><span>&gt;</span></span>
          <br />
          <span
            ><span>&lt;</span>button<span>
              class<span>="btn btn-outline-success"</span> type<span
                >="button"</span
              >
              @click <span>="showAlert"</span>/</span
            ><span>&gt;</span></span
          >
        </div>
      </div>
      <div class="col-6">
        <button type="button" class="btn btn-danger" @click="showAlertError">
          click error
        </button>
        <div class="box">
          <span><span>&lt;</span>script<span></span><span>&gt;</span></span>
          <br />
          import { showSweetAlert } from "~/shared/utils/alert";
          <br />
          <br />
          const showAlert = () => {
          <br />
          showSweetAlert("Internal server error", "error", 4000, true,
          "top-end"); <br />
          }
          <br />
          ....
          <br />
          <span><span>&lt;</span>/script<span></span><span>&gt;</span></span>
          <br />
          <span
            ><span>&lt;</span>button<span>
              class<span>="btn btn-outline-success"</span> type<span
                >="button"</span
              >
              @click <span>="showAlert"</span>/</span
            ><span>&gt;</span></span
          >
        </div>
      </div>
      <div class="col-6">
        <button type="button" class="btn btn-dark" @click="showAlertInfo">
          click secondary
        </button>
        <div class="box">
          <span><span>&lt;</span>script<span></span><span>&gt;</span></span>
          <br />
          import { showSweetAlert } from "~/shared/utils/alert";
          <br />
          <br />
          const showAlert = () => {
          <br />
          showSweetAlert("Save que", "info", 5000, false, "bottom-end"); <br />
          }
          <br />
          ....
          <br />
          <span><span>&lt;</span>/script<span></span><span>&gt;</span></span>
          <br />
          <span
            ><span>&lt;</span>button<span>
              class<span>="btn btn-outline-success"</span> type<span
                >="button"</span
              >
              @click <span>="showAlert"</span>/</span
            ><span>&gt;</span></span
          >
        </div>
      </div>
    </div>

    <!--
      /*********************************************/
                          Card
      /*********************************************/
    -->
    <div class="row">
      <p class="top">Card</p>
      <div class="col-12">
        <div
          style="
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: center;
          "
        >
          <div class="card-song-preview card-ex"></div>
          <p>card-song-preview (40px x 40px)</p>
        </div>
      </div>
      <div class="mt-5"></div>
      <div class="card-song card-ex">
        card-song
        <br />
        (180px x 180px)
      </div>
      <div class="card-circle card-ex">
        card-circle <br />
        (180px x 180px)
      </div>
      <div class="card-playlist card-ex">
        card-playlist <br />
        (180px x 180px)
      </div>
      <div class="card-latest-release card-ex">
        card-latest-release <br />
        (192px x 170px)
      </div>
    </div>
    <!--
      /*********************************************/
                          Radius
      /*********************************************/
    -->
    <div class="row">
      <p class="top">Radius</p>
      <div class="item-ex">
        <div class="rounded card-radius-ex">5px <br />rounded</div>
        <div class="rounded-normal card-radius-ex">
          8px <br />rounded-normal
        </div>
        <div class="rounded-medium card-radius-ex">
          20px <br />rounded-medium
        </div>
        <div
          class="rounded-large card-radius-ex"
          style="width: 250px; height: 60px"
        >
          40px <br />rounded-large
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "assets/scss/style";
.body {
  background-color: white;
  color: black;
  padding: 20px;
}

.mt-10 {
  margin-top: 100px;
}

.row {
  padding: 20px 20px;
}
.top {
  @include h6;
  color: $purple;
  margin: 20px 0px;
}

.card-radius-ex {
  width: 146px;
  height: 136px;
  background-color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-ex {
  background-color: $silver;
  padding: 20px;
  max-width: 900px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  text-align: center;
  gap: 50px;
}

.card-ex {
  background-color: $silver;
  width: 800px;
  height: 500px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.box {
  border: 1px solid #000;
  padding: 20px;
  margin: 10px 0px;
}

.font {
  h1 {
    @include h1;
  }
  h2 {
    @include h2;
  }
  h3 {
    @include h3;
  }
  h4 {
    @include h4;
  }
  h5 {
    @include h5;
  }
  h6 {
    @include h6;
  }
  .subtitle-1 {
    @include font-subtitle-1;
  }
  .subtitle-2 {
    @include font-subtitle-2;
  }
  .body-1 {
    @include font-body-1;
  }
  .body-2 {
    @include font-body-2;
  }

  .body-3 {
    @include font-body-3;
  }

  .button-1 {
    @include font-button-1;
  }

  .button-2 {
    @include font-button-2;
  }
}

.card-color-p {
  display: flex;
  flex-direction: row;
  gap: 10px;
  font-size: 10px;
  flex-wrap: wrap;

  .black {
    background-color: $black;
  }
  .blue {
    background-color: $blue;
  }
  .violet-red {
    background-color: $violet-red;
  }
  .royal-blue {
    background-color: $royal-blue;
  }
  .pale-magenta {
    background-color: $pale-magenta;
  }
  .purple-heart {
    background-color: $purple-heart;
  }
  .lilac {
    background-color: $lilac;
  }
  .white {
    background-color: $white;
    border: 1px solid #000;
  }
  .mauve {
    background-color: $mauve;
  }
  .silver {
    background-color: $silver;
  }
  .medium-purple {
    background-color: $medium-purple;
  }
  .perano {
    background-color: $perano;
  }
  .pastel-blue {
    background-color: $pastel-blue;
  }
  .cornflower-blue {
    background-color: $cornflower-blue;
  }
  .glowing-purple {
    background-color: $glowing-purple;
  }
  .red-violet {
    background-color: $red-violet;
  }
  .salmon {
    background-color: $salmon;
  }
  .electric-indigo {
    background-color: $electric-indigo;
  }
  .blue-violet {
    background-color: $blue-violet;
  }
  .seance {
    background-color: $seance;
  }
  .lightning-yellow {
    background-color: $lightning-yellow;
  }
  .victoria {
    background-color: $victoria;
  }
  .christalle {
    background-color: $christalle;
  }
  .purple {
    background-color: $purple;
  }

  .white-dove {
    background-color: $white-dove;
    border: 1px solid #000;
  }
  .violet-blue {
    background-color: $violet-blue;
  }
  .black-russian {
    background-color: $black-russian;
  }
}

.card-color-s {
  display: flex;
  flex-direction: row;
  gap: 10px;
  font-size: 12px;
  flex-wrap: wrap;
  .bunker {
    background-color: $bunker;
  }
  .nero {
    background-color: $nero;
  }
  .cloud-burst {
    background-color: $cloud-burst;
  }
  .eclipse {
    background-color: $eclipse;
  }
  .tuna {
    background-color: $tuna;
  }
  .moon-raker {
    background-color: $moon-raker;
  }
  .gainsboro {
    background-color: $gainsboro;
  }
  .snow {
    background-color: $snow;
    border: 1px solid #000;
  }
  .red {
    background-color: $red;
  }
  .orange {
    background-color: $orange;
  }
  .green {
    background-color: $green;
  }
  .myrtle {
    background-color: $myrtle;
  }
  .light-red {
    background-color: $light-red;
  }
  .light-yellow {
    background-color: $light-yellow;
  }
  .light-green {
    background-color: $light-green;
  }
  .dark-purple {
    background-color: $dark-purple;
  }
  .conifer {
    background-color: $conifer;
  }
  .raw-umber {
    background-color: $raw-umber;
  }
  .kournikova {
    background-color: $kournikova;
  }
  .sapphire {
    background-color: $sapphire;
  }
  .light-blue {
    background-color: $light-blue;
  }
  .black-hover {
    background-color: $black-hover;
  }

  .sea {
    background-color: $sea;
  }
}

.card-color {
  width: 140px;
  height: 140px;
}

.card-button {
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
}

.card-input {
  background-color: $nero;
  padding: 20px;
  .highlight {
    @include font-body-1;
    margin-top: 20px;
    background-color: $white;
    padding: 20px;
  }
}
</style>
