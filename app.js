var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.json());

const mysql = require ('mysql');

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'aquaresifpanel'
  });

db.connect((err) => {
    if(err)
    {
        throw err;
    }
    console.log("sql bağlandı");

})

app.use(bodyParser.json());



//Login Servisi// Veri tipi: {"kulAdi":"Boz","kulSifre":"1234"}
app.post("/login", (req, res) => {
    
    var user = {
        "kulAdi":req.body.kulAdi,
        "kulSifre":req.body.kulSifre
    }
    console.log("gelen kullanici:"+ user.kulAdi+" "+ "gelen sifre:" + user.kulSifre);
    let sql ='SELECT * FROM tbl_kullanicilar WHERE kulAdi = ? AND kulSifre = ?';
    let data = [user.kulAdi,user.kulSifre];
    let querry = db.query(sql,data, (err, result) =>{
        if(err){throw err;
            res.send(err.message);
        } 
        else{
            console.log(result);
            let selectedUser = JSON.stringify(result);
            var obj = JSON.parse(selectedUser);
            if(result.length > 0 )
            {
                res.send(selectedUser);
            }
            else
            {
                res.send("Geçersiz Giriş");
            }
        }

    });

});

//Tüm kategorileri listeler
app.get('/kategoriListele', function (req, res) {
    
    let sql = 'SELECT * FROM tbl_kategoriler'
    let querry = db.query(sql,(err, result) => {
        if(err) throw err;
        console.log("result: "+ result);
        let okunan = JSON.stringify(result);
        console.log("json: "+okunan);
        res.send(okunan);
    }); 
	
});




//Kategori sil// Veri tipi: {"katId":1}
app.post("/kategoriSil", (req, res) => {
    console.log("/kategoriSil")
    var secilenKategori = {
        "katId": req.body.katId
    }
    let sql = "DELETE FROM tbl_kategoriler WHERE katId= ?";
    data = [secilenKategori.katId];
    db.query(sql,data,(err,result) =>{
        if(err){ 
            throw err
        }
        else{

            console.log(secilenKategori.katId + " numaralı kategori Silindi");
            res.send(secilenKategori.katId + " numaralı kategori Silindi");
        }   
    });  
        
});

//Kategori Güncelle// veri tipi: {"katId":2,"katAdi":"Sehpa"}
app.post("/kategoriGuncelle", (req, res) => {
    
    var secilenKategori = {
        "katId":req.body.katId,
        "katAdi":req.body.katAdi
    }
    console.log(secilenKategori.katAdi);
    let sql = 'UPDATE tbl_kategoriler SET katAdi = ? WHERE katId = ?';
    let data = [req.body.katAdi,req.body.katId];
    db.query(sql,data,(err,result) => {

        if(err) {throw err;
        console.log("güncelleneMEdi");
        res.send("güncelleneMEdi");
        }
        else{
            console.log(secilenKategori.katId + "numaralı kategorinin adı "+ secilenKategori.katAdi+" olarak güncellendi");
            res.send("güncellendi");
        }

    })
    
});

//Kategori ekleme// veri tipi: {"katAdi":"Kategorinin adı"}
app.post("/kategoriEkle", (req, res) => {
    
    var yeniKategori = {
        "katAdi":req.body.katAdi
    }
    console.log(yeniKategori.katAdi);
    let sql ='INSERT INTO tbl_kategoriler SET ?';
    let querry = db.query(sql,yeniKategori, (err, result) =>{
        if(err) throw err;
        console.log(result);
        res.send(yeniKategori.katAdi + " kategorisi eklendi");


    });

});


//Ürün ekleme servisi// veri tipi: {"katId":"5","urunAdi":"Örnek ürün2","urunAciklama":"Örnek ürün açıklaması2","urunFiyat":2000,"urunMarka":"Örnek Ürün Markası2"}
app.post("/urunEkle", (req, res) => {
    
    var yeniUrun = {
        "katId":req.body.katId,
        "urunAdi":req.body.urunAdi,
        "urunAciklama":req.body.urunAciklama,
        "urunFiyat":req.body.urunFiyat,
        "urunMarka":req.body.urunMarka
    }
    console.log(yeniUrun.urunAdi);
    let sql ='INSERT INTO tbl_urunler (katId,urunAdi,urunAciklama,urunFiyat,urunMarka) VALUES (?,?,?,?,?) ';
    let data = [yeniUrun.katId,yeniUrun.urunAdi,yeniUrun.urunAciklama,yeniUrun.urunFiyat,yeniUrun.urunMarka];
    let querry = db.query(sql,data, (err, result) =>{
        if(err) {
            throw err;
            res.send(err.message);
        }
        else
        {
            res.send(yeniUrun.urunAdi + " Ürünü eklendi");
        }
    });

});


//Ürün sil// Veri tipi: {"urunId":1}
app.post("/urunSil", (req, res) => {
    var secilenUrun = {
        "urunId": req.body.urunId
    }
    let sql = "DELETE FROM tbl_urunler WHERE urunId= ?";
    data = [secilenUrun.urunId];
    db.query(sql,data,(err,result) =>{
        if(err){ 
            throw err
        }
        else{

            console.log(secilenUrun.urunId + " numaralı ürün Silindi");
            res.send(secilenUrun.urunId + " numaralı ürün Silindi");
        }   
    });  
        
});


//Ürün Güncelle// veri tipi:  {"urunId":4,"katId":"5","urunAdi":"güncel Örnek ürün2","urunAciklama":"Örnek ürün açıklaması2","urunFiyat":2000,"urunMarka":"Örnekxxxxxx Ürün Markası2"}
app.post("/urunGuncelle", (req, res) => {
    
    var secilenUrun = {
        "urunId":req.body.urunId,
        "katId":req.body.katId,
        "urunAdi":req.body.urunAdi,
        "urunAciklama":req.body.urunAciklama,
        "urunFiyat":req.body.urunFiyat,
        "urunMarka":req.body.urunMarka
    }
    console.log(secilenUrun.urunAdi);
    let sql = 'UPDATE tbl_urunler SET katId = ? , urunAdi= ? , urunAciklama = ? , urunFiyat = ? , urunMarka = ? WHERE urunId = ?';
    let data = [secilenUrun.katId,secilenUrun.urunAdi,secilenUrun.urunAciklama,secilenUrun.urunFiyat,secilenUrun.urunMarka,secilenUrun.urunId];
    db.query(sql,data,(err,result) => {

        if(err) {throw err;
        console.log("güncelleneMEdi");
        res.send(secilenUrun.urunId + "İd li ürün güncelleneMEdi");
        }
        else{
            res.send(secilenUrun.urunId + "İd li ürün güncellendi");
        }

    })
    
});

//Ürün Listeleme //
app.post("/urunListele",(req,res) =>{
    var secilenKategori = {
        "katId":req.body.katId
    }
    let sql = "SELECT * FROM tbl_urunler WHERE katId = ?";
    let data = [secilenKategori.katId];
    db.query(sql,data,(err,result) =>{
        if(err)
        {
            throw err;
            res.send(err.message);
        }
        else{
            var urunler = JSON.stringify(result);
            console.log(urunler);
            res.send(urunler);
        }
    });

});


//Tüm Birim Fiyatları listeler
app.get('/birimFiyatListele', function (req, res) {
    
    let sql = 'SELECT * FROM tbl_birim_fiyatlar'
    let querry = db.query(sql,(err, result) => {
        if(err) throw err;
        console.log("result: "+ result);
        let okunan = JSON.stringify(result);
        console.log("json: "+okunan);
        res.send(okunan);
    }); 
	
});




//Teklif Fonksiyonları


//Teklif Base Ekle

//Teklif Base ekleme servisi//  teklif_no - musteri - ilgiliKisi - email - gsm - konu - teslimYeri - odemeSekli - teslimSuresi - tarih - toplamFiyat
app.post("/teklifEkle", (req, res) => {
    console.log("********Teklif isteği geldi");
    console.log(req.body);
    //console.log(req.body.tumUrunler);





    var teklifUrunler = req.body.tumUrunler;

    var yeniTeklif = {
        "teklif_no":req.body.teklif_no,
        "musteri":req.body.musteri,
        "ilgiliKisi":req.body.ilgiliKisi,
        "email":req.body.email,
        "gsm":req.body.gsm,
        "konu":req.body.konu,
        "teslimYeri":req.body.teslimYeri,
        "odemeSekli":req.body.odemeSekli,
        "teslimSuresi":req.body.teslimSuresi,
        "tarih":req.body.tarih,
        "teklifVeren":req.body.teklifVeren,
        "toplamFiyat":req.body.toplamFiyat
    }
    
    let sql ='INSERT INTO tbl_teklif_base (teklif_no,musteri,ilgiliKisi,email,gsm,konu,teslimYeri,odemeSekli,teslimSuresi,tarih,toplamFiyat,teklifVeren) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ';
    let data = [yeniTeklif.teklif_no,
    yeniTeklif.musteri,
    yeniTeklif.ilgiliKisi,
    yeniTeklif.email,
    yeniTeklif.gsm,
    yeniTeklif.konu,
    yeniTeklif.teslimYeri,
    yeniTeklif.odemeSekli,
    yeniTeklif.teslimSuresi,
    yeniTeklif.tarih,
    yeniTeklif.toplamFiyat,
    yeniTeklif.teklifVeren
    ];
    let querry = db.query(sql,data, (err, result) =>{
        if(err) {
            throw err;
        }
        else
        {
            console.log("Teklif Eklendi");
        }
    });


    var sayac=0;
    for(var urun in teklifUrunler)
    {
        var kAdi = teklifUrunler[sayac]["urunKatAdi"];
        var uAdi = teklifUrunler[sayac]["urunAdi"];
        var uAciklama = teklifUrunler[sayac]["urunAciklama"];
        var uMarka= teklifUrunler[sayac]["marka"];
        var uAdet = teklifUrunler[sayac]["adet"];
        var uBFiyat = teklifUrunler[sayac]["fiyat"];
        var uTFiyat = teklifUrunler[sayac]["toplamFiyat"];



        let sql ='INSERT INTO tbl_teklif_urunler (teklif_no,urunKatAdi,urunAdi,urunAciklama,urunMarka,urunAdet,urunBirimFiyat,urunToplamFiyat) VALUES (?,?,?,?,?,?,?,?) ';
        let data = [yeniTeklif.teklif_no,
            kAdi,
            uAdi,
            uAciklama,
            uMarka,
            uAdet,
            uBFiyat,
            uTFiyat
        ];
        let querry = db.query(sql,data, (err, result) =>{
            if(err) {
                throw err;
            }
            else
            {
				
            }
        });

        sayac++;
    }

    res.send(yeniTeklif.teklif_no)
    
});

//Teklif No

app.get('/teklifNo', function (req, res) {
    
    let sql = 'SELECT * FROM tbl_teklif_sayac'
    let querry = db.query(sql,(err, result) => {
        if(err) throw err;
        let okunan = JSON.stringify(result);
        var tNo = JSON.parse(okunan);
        console.log("tno: "+ tNo[0]["teklifNoSayac"]);

        let sql = 'UPDATE tbl_teklif_sayac SET teklifNoSayac = ?';
        var yeniNo = tNo[0]["teklifNoSayac"]+1; 
        let data = [yeniNo];
        db.query(sql,data,(err,result) => {

            if(err) {throw err;
                console.log("güncelleneMEdi");
            }
            else{
                
            }

    });

    res.send({yeniTeklifNo:yeniNo});

    }); 
	
});

//Ada Göre Teklif Arama
app.post("/teklifAraAd",(req,res) =>{
    var aranan = {
        "arananAd":req.body.secilenAd
    }

    console.log("********");

    console.log(aranan.arananAd);

    console.log("********");
    let sql = "SELECT * FROM tbl_teklif_base WHERE musteri like '%"+aranan.arananAd+"%' ";
    console.log(sql);
    db.query(sql,(err,result) =>{
        if(err)
        {
            throw err;
            res.send(err.message);
        }
        else{
            var teklifler = JSON.stringify(result);
            console.log(teklifler);
            res.send(teklifler);
        }
    });

});


app.post("/teklifAraTeklifNo",(req,res) =>{
    var aranan = {
        "arananNo":req.body.secilenNo
    }

    console.log("********");

    console.log(aranan.arananNo);

    console.log("********");
    let sql = "SELECT * FROM tbl_teklif_base WHERE teklif_no = "+aranan.arananNo;
    console.log(sql);
    db.query(sql,(err,result) =>{
        if(err)
        {
            throw err;
            res.send(err.message);
        }
        else{
            var teklifler = JSON.stringify(result);
            console.log(teklifler);
            res.send(teklifler);
        }
    });

});

app.post("/teklifAraBilgiler",(req,res) =>{
    var aranan = {
        "arananNo":req.body.secilenNo
    }
    let sql = "SELECT * FROM tbl_teklif_urunler WHERE teklif_no = "+aranan.arananNo;
    console.log(sql);
    db.query(sql,(err,result) =>{
        if(err)
        {
            throw err;
            res.send(err.message);
        }
        else{
            var teklifUrunler = JSON.stringify(result);
            console.log(teklifUrunler);
            res.send(teklifUrunler);
        }
    });

});


app.post("/teklifGuncelle", (req, res) => {
    console.log("********Teklif güncelle isteği geldi");
    console.log(req.body);
    var teklifUrunler = req.body.tumUrunler;

    var yeniTeklif = {
        "teklif_no":req.body.teklif_no,
        "musteri":req.body.musteri,
        "ilgiliKisi":req.body.ilgiliKisi,
        "email":req.body.email,
        "gsm":req.body.gsm,
        "konu":req.body.konu,
        "teslimYeri":req.body.teslimYeri,
        "odemeSekli":req.body.odemeSekli,
        "teslimSuresi":req.body.teslimSuresi,
        "tarih":req.body.tarih,
        "teklifVeren":req.body.teklifVeren,
        "toplamFiyat":req.body.toplamFiyat
    }

    let sqlBaseSil = "DELETE FROM tbl_teklif_base WHERE teklif_no=?";
    let silBaseData = [yeniTeklif.teklif_no];
    let querryBaseSil = db.query(sqlBaseSil,silBaseData, (err, result) =>{
        if(err) {
            throw err;
        }
        else
        {
            console.log("Teklif base'den "+yeniTeklif.teklif_no+" silindi");
        }
    });

    let sqlUrunlerSil = "DELETE FROM tbl_teklif_urunler WHERE teklif_no=?";
    let silUrunlerData = [yeniTeklif.teklif_no];
    let querryUrunSil = db.query(sqlUrunlerSil,silUrunlerData, (err, result) =>{
        if(err) {
            throw err;
        }
        else
        {
            console.log("Teklif Ürünlerder'den "+yeniTeklif.teklif_no+" silindi");
        }
    });

    
    let sql ='INSERT INTO tbl_teklif_base (teklif_no,musteri,ilgiliKisi,email,gsm,konu,teslimYeri,odemeSekli,teslimSuresi,tarih,toplamFiyat,teklifVeren) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ';
    let data = [yeniTeklif.teklif_no,
    yeniTeklif.musteri,
    yeniTeklif.ilgiliKisi,
    yeniTeklif.email,
    yeniTeklif.gsm,
    yeniTeklif.konu,
    yeniTeklif.teslimYeri,
    yeniTeklif.odemeSekli,
    yeniTeklif.teslimSuresi,
    yeniTeklif.tarih,
    yeniTeklif.toplamFiyat,
    yeniTeklif.teklifVeren
    ];
    let querry = db.query(sql,data, (err, result) =>{
        if(err) {
            throw err;
			
        }
        else
        {
            console.log("Teklif Eklendi");
			
        }
    });


    var sayac=0;
    for(var urun in teklifUrunler)
    {
        var kAdi = teklifUrunler[sayac]["urunKatAdi"];
        var uAdi = teklifUrunler[sayac]["urunAdi"];
        var uAciklama = teklifUrunler[sayac]["urunAciklama"];
        var uMarka= teklifUrunler[sayac]["marka"];
        var uAdet = teklifUrunler[sayac]["adet"];
        var uBFiyat = teklifUrunler[sayac]["fiyat"];
        var uTFiyat = teklifUrunler[sayac]["toplamFiyat"];


        //teklif_no	urunKatAdi	urunAdi	urunAciklama	urunMarka	urunAdet	urunBirimFiyat	urunToplamFiyat

        let sql ='INSERT INTO tbl_teklif_urunler (teklif_no,urunKatAdi,urunAdi,urunAciklama,urunMarka,urunAdet,urunBirimFiyat,urunToplamFiyat) VALUES (?,?,?,?,?,?,?,?) ';
        let data = [yeniTeklif.teklif_no,
            kAdi,
            uAdi,
            uAciklama,
            uMarka,
            uAdet,
            uBFiyat,
            uTFiyat
        ];
        let querry = db.query(sql,data, (err, result) =>{
            if(err) {
                throw err;
            }
            else
            {
				
            }
        });

        sayac++;
    }

    res.send(yeniTeklif.teklif_no+" numaraılı teklif güncellendi.")
    
});


//Teklif Sil
app.post("/teklifSil", (req, res) => {
    console.log("********Teklif Sil isteği geldi");
    console.log(req.body);
    var teklifUrunler = req.body.tumUrunler;

    var yeniTeklif = {
        "teklif_no":req.body.teklif_no
    }

    let sqlBaseSil = "DELETE FROM tbl_teklif_base WHERE teklif_no=?";
    let silBaseData = [yeniTeklif.teklif_no];
    let querryBaseSil = db.query(sqlBaseSil,silBaseData, (err, result) =>{
        if(err) {
            throw err;
        }
        else
        {
            console.log("Teklif base'den "+yeniTeklif.teklif_no+" silindi");
        }
    });

    let sqlUrunlerSil = "DELETE FROM tbl_teklif_urunler WHERE teklif_no=?";
    let silUrunlerData = [yeniTeklif.teklif_no];
    let querryUrunSil = db.query(sqlUrunlerSil,silUrunlerData, (err, result) =>{
        if(err) {
            throw err;
        }
        else
        {
            console.log("Teklif Ürünlerder'den "+yeniTeklif.teklif_no+" silindi");
        }
    });

    res.send(yeniTeklif.teklif_no + " Numaralı teklif silinmiştir");


});



let serverPort = process.env.PORT || 8080;
var server = app.listen(serverPort, function () {
	console.log('Sunucu calisiyor');
});