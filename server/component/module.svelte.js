import { mount } from "svelte";
import Game from "./Test.svelte";

export default async function (target, props) {
  return mount(Game, { target, props });
}
