import {AutoTokenizer, pipeline} from '@xenova/transformers';

let classifier = await pipeline('token-classification');
let tokenizer = await AutoTokenizer.from_pretrained("Xenova/bert-base-uncased");

async function generate_classifications(input_str) {
  document.getElementById("tok_viz").innerHTML = ""
  let tok_arr = await classifier(input_str, {ignore_labels: []});
  let cur_tok = ""
  for (let tok_idx = 0; tok_idx < tok_arr.length; tok_idx++) {
    if(tok_arr[tok_idx]["word"][0] == "#") {
      cur_tok += tok_arr[tok_idx]["word"].replace(/^#+/, '')
    } else {
      cur_tok = tok_arr[tok_idx]["word"]
    }
    if (tok_arr[tok_idx+1] && tok_arr[tok_idx+1]["word"][0] == "#") {
      continue
    }

    if(tok_arr[tok_idx]["entity"] == 'O') {
      let tmpl = document.createElement('template');
      tmpl.innerHTML = "<div class='tok plain'><span class='tok_s'>" + cur_tok + "</span></div>"
      document.getElementById("tok_viz").append(tmpl.content.children[0])
    } else {
      let tmpl = document.createElement('template');
      tmpl.innerHTML = "<div class='tok'><span class='tok_s'>" + cur_tok + "</span><span class='tok_i'>" + tok_arr[tok_idx]["entity"] + "</span></div>"
      document.getElementById("tok_viz").append(tmpl.content.children[0])
    }

  }
}

let tok_input = document.getElementsByName("tok_input")[0]
function updateTokViz(evt) {
  if (!evt.target.value) {
    generate_classifications(tok_input.placeholder)
  } else {
    generate_classifications(evt.target.value)
  }
}
tok_input.addEventListener("keyup", updateTokViz);
generate_classifications(tok_input.placeholder)
