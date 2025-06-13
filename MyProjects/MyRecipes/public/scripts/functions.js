$(function () {
  menuCategory();
  getRecipeById();
  subMenuCategory();
  inputFromBar();
  bringAlert()
});


function menuCategory() { 
  $('.menu-item').on('click', function () { 
    const category = $(this).data('value'); // Seçilen kategori 
    $('#selectedCategory').val(category); // Formdaki input'u güncelle 
    $('#menuForm').submit(); // Formu otomatik gönder (tam sayfa açılmasını sağlar) 
    /*$.ajax({ 
    url: `/menu?category=${encodeURIComponent(category)}`, // Güvenli şekilde URL’ye ekleme 
    method: 'GET', 
    dataType: 'html', // Yanıtın HTML formatında olduğunu belirtiyoruz 
    success: (response) => { 
      if (response.trim()) { // Yanıt boşsa hata mesajı vermeyelim 
      $('#menu-content').html(response); // Yeni içeriği sayfaya ekle }
      else { $('#menu-content').html("<p>Bu kategori için tarif bulunamadı.</p>"); } }, 
      error: (xhr, status, error) => { 
        console.error("Hata oluştu:", status, error); 
        $('#menu-content').html("<p>Veri çekilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>"); } });*/ 
  }); 
} 
function getRecipeById() {
  $('.recipe-item').on('click', function () {
    const recipeId = $(this).attr("data-value");
    const isDrink = $(this).attr("data-isdrink"); // HTML'de 'data-isDrink' yazılsa da JS'de küçük harf!

    console.log("Seçilen Tarif ID:", recipeId);
    console.log("İçecek mi?:", isDrink);

    if (!recipeId || recipeId.trim() === "") {
      console.error("‼️ Hata: Tarif ID boş veya yanlış!");
      return;
    }

    // Formdaki gizli inputlara değerleri yerleştir
    $('#selectedRecipe').val(recipeId);
    $('#isDrink').val(isDrink);

    console.log("Formdaki Seçilen Tarif:", $('#selectedRecipe').val());
    console.log("Formdaki İçecek Durumu:", $('#isDrink').val());

    // Formu gönder
    $('#recipeForm').submit();
  });
}

function subMenuCategory() {
  $('.menu-item').on('click', function () {
    const subCategory = $(this).data("value");
    console.log("Seçilen Alt Kategori:", subCategory);
    

    $('#selectedSubCategory').val(subCategory);
    console.log("Form İçindeki SubCategory Değeri:", $('#selectedSubCategory').val());

    $('#subMenuForm').submit();
    console.log("Form gönderildi!"); // Bu satır görünüyor mu?
  });
}

function inputFromBar(){
  $('#search-button').on('click', function(){
    const recipe = $("#search-input").val();
    console.log(recipe);
  });
}

function bringAlert(){
  setTimeout(() => {
    const alertEl = $('.alert');
    if (alertEl) {
      alertEl.classList.remove('show');
      alertEl.classList.add('fade');
    }
  }, 1000); // 1 saniye sonra kapanır
}