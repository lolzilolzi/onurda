document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault();
  const ad = document.getElementById("ad").value.trim();
  const mesaj = document.getElementById("mesaj").value.trim();
  const fotoInput = document.getElementById("foto");
  const fotoDosya = fotoInput.files[0];

  if (!ad || !mesaj) return;

  const eskiMesajlar = JSON.parse(localStorage.getItem("onurMesajlar")) || [];

  if (fotoDosya) {
    const reader = new FileReader();
    reader.onload = function() {
      const base64foto = reader.result;
      eskiMesajlar.push({ ad, mesaj, foto: base64foto });
      localStorage.setItem("onurMesajlar", JSON.stringify(eskiMesajlar));
      document.getElementById("form").reset();
      document.getElementById("success").style.display = "block";
    };
    reader.readAsDataURL(fotoDosya);
  } else {
    eskiMesajlar.push({ ad, mesaj, foto: null });
    localStorage.setItem("onurMesajlar", JSON.stringify(eskiMesajlar));
    document.getElementById("form").reset();
    document.getElementById("success").style.display = "block";
  }
});
