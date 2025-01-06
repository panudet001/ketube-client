import { environment } from "~/services/environments";
import { useKaraokeStore } from "~/store/useKaraokeStore";

interface State {
  room: string | null;
  user: string | null;
  urlRemote: string | null;
}

export const useRemoteStore = defineStore("useRemoteStore", {
  state: (): State => {
    return {
      room: "",
      user: "",
      urlRemote: "",
    };
  },
  actions: {
    generateRandomText(length: number) {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }
      return result;
    },
    createRoom() {
      const room = useKaraokeStore();
      this.room = room.isRoom ? room.roomName : this.generateRandomText(9);

      localStorage.setItem("ketube-room", this.room);

      this.room = localStorage.getItem("ketube-room");
      this.urlRemote = environment.urlBaseApp + "/remote-controls/" + this.room;
    },
    createUser() {
      this.user = this.generateRandomText(9);
      if (!localStorage.getItem("ketube-user")) {
        localStorage.setItem("ketube-user", this.user);
      }

      this.user = localStorage.getItem("ketube-user");
    },
    resetRoom() {
      this.room = this.generateRandomText(9);
      // localStorage.setItem("ketube-room", this.room);
      // this.urlRemote = environment.urlBaseApp + "/remote-controls/" + this.room;
      // this.room = localStorage.getItem("ketube-room");
      window.location.reload();
    },
    getRoom() {
      this.room = localStorage.getItem("ketube-room");
      this.urlRemote = environment.urlBaseApp + "/remote-controls/" + this.room;
    },
  },
});
