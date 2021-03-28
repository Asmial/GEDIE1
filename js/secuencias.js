for (let i = 0; i < 8; i++) {
    $("#contenedor-secuencias").append(
        `<div class="col-xs-24 col-sm-12 col-md-8 col-lg-6 col-xxl-4 col-xxxl-3 d-flex justify-content-center">
    <a class= "thumbnail" href = "#">
    <img id="eleccion${i}" class="imageUp" src="img/${i % 2 == 0 ? "hungerEmptyIcon" : "peralesDormidoFeliz"}.png" width="200"
        height="200"></a>
    </div >`);

}