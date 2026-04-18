
## Katı Gıda Takip Özelliği Planı

Çocuğun katı gıdaya geçiş sürecini takip edebileceğiniz kapsamlı bir özellik ekleyeceğim.

### Veritabanı Yapısı

**1. `food_categories` tablosu** (sabit kategori listesi)
- `id`, `name` (örn. Sebzeler, Meyveler, Tahıllar, Et/Protein, Süt Ürünleri, Baklagiller, Atıştırmalıklar), `icon`, `color`, `sort_order`
- Önceden tanımlı kategorilerle dolu gelecek

**2. `foods` tablosu** (gıda kütüphanesi)
- `id`, `name`, `category_id`, `user_id` (kim ekledi), `is_default` (sistem mi kullanıcı mı ekledi)
- Hem ortak (varsayılan gıdalar) hem kullanıcıya özel gıdalar

**3. `child_foods` tablosu** (çocuğun gıda denemeleri)
- `id`, `child_id`, `food_id`, `user_id`
- `first_tried_date` — ilk denenme tarihi
- `reaction` — enum: `loved` (sevdi 😍), `liked` (beğendi 🙂), `neutral` (kararsız 😐), `disliked` (sevmedi 😕), `allergic` (alerji ⚠️)
- `notes` — opsiyonel notlar (örn. "kızarıklık oldu", "tekrar denenebilir")
- `created_at`, `updated_at`
- Unique: `(child_id, food_id)` — aynı gıda için tek kayıt, güncellenebilir

Tüm tablolarda RLS: paylaşılan çocuklar için `user_has_child_access` fonksiyonu kullanılacak.

### Sayfa & Bileşenler

**Yeni sayfa: `/foods/:childId` — "Beslenme Günlüğü"**
- Üstte özet: kaç gıda denendi, kaç tanesi sevildi, kaç alerji
- Kategori sekmeleri (Sebzeler, Meyveler, vs.) — yatay kaydırılabilir
- Her kategori altında o kategorideki gıdalar grid olarak listelenir
- Her gıda kartında: gıda adı, durum rozeti (denenmedi / reaksiyon emojisi), ilk deneme tarihi
- Karta tıklayınca dialog açılır: tarih seç, reaksiyon seç (5 emoji butonu), not ekle, kaydet/sil
- Sağ üstte "+ Yeni Gıda Ekle" butonu — kategori seç, isim gir
- Filtre: "Tümü / Denenenler / Sevilenler / Alerjiler"

**Ana sayfa entegrasyonu:**
- `ChildCard` üzerine "Beslenme" butonu eklenecek (Milestones / Measurements yanına)
- Mini özet: "X gıda denendi, Y tanesi favori"

### Varsayılan Gıdalar (Migration ile eklenecek)
Türk mutfağına uygun ~40-50 temel bebek gıdası: muz, elma, havuç, brokoli, yoğurt, yumurta sarısı, pirinç lapası, mercimek çorbası, vs.

### Teknik Detaylar
- `src/pages/Foods.tsx` — yeni sayfa
- `src/components/FoodCard.tsx` — gıda kartı + reaksiyon dialog'u
- `src/components/AddFoodDialog.tsx` — özel gıda ekleme
- `src/lib/foodReactions.ts` — reaksiyon enum/emoji/renk haritası
- App.tsx'e yeni route
- ChildCard'a navigasyon butonu

### Sonraki adımlar (bu plandan sonra)
- Alerji uyarı sistemi (alerjik işaretlenen gıdalar dashboard'da uyarı)
- Beslenme istatistikleri grafiği (kategori dağılımı)
- AI sohbete beslenme verisi entegrasyonu
