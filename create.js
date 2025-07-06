function highlight(id) {
  const el = document.getElementById(id);
  el.focus();
  el.select();
  el.setSelectionRange(0, el.value.length);
  return el;
}

function validateInputs() {
  const url = document.getElementById("url");
  try {
    const parsed = new URL(url.value);
    if (!["http:", "https:", "magnet:"].includes(parsed.protocol)) {
      url.setCustomValidity("Only http, https, or magnet links allowed.");
      url.reportValidity();
      return false;
    }
  } catch {
    url.setCustomValidity("Invalid URL format.");
    url.reportValidity();
    return false;
  }
  return true;
}

async function generateLink(url, password, hint, useSalt, useIv) {
  const api = apiVersions[LATEST_API_VERSION];
  const salt = useSalt ? await api.getSalt() : null;
  const iv = useIv ? await api.getIV() : null;
  const encrypted = await api.encrypt(url, password, salt, iv);

  const payload = {
    v: LATEST_API_VERSION,
    e: b64.encodeBytes(new Uint8Array(encrypted))
  };

  if (hint) payload.h = hint;
  if (salt) payload.s = b64.encodeBytes(salt);
  if (iv) payload.i = b64.encodeBytes(iv);

  return b64.encodeText(JSON.stringify(payload));
}

async function onEncrypt() {
  if (!validateInputs()) return;

  const pass = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;
  if (pass !== confirm) {
    alert("Passwords don't match.");
    return;
  }

  const url = document.getElementById("url").value;
  const hint = document.getElementById("hint").value;
  const useIv = document.getElementById("iv").checked;
  const useSalt = document.getElementById("salt").checked;

  const fragment = await generateLink(url, pass, hint, useSalt, useIv);
  const finalLink = `https://athulweb.github.io/#${fragment}`;

  document.getElementById("output").value = finalLink;
  document.getElementById("open").href = finalLink;

  highlight("output");
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function onCopy(id) {
  const field = highlight(id);
  document.execCommand("copy");
  field.blur();
}

function main() {
  console.log("🔐 Link Locker Loaded");
}
