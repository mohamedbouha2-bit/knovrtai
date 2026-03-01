/**
 * دالة ذكية لجلب روابط الصور بناءً على الكلمات المفتاحية أو الأوصاف.
 * @param keywords - الكلمات المفتاحية للبحث (أو رابط مباشر).
 * @param orientation - اتجاه الصورة (landscape, portrait, squarish).
 * @param propKey - مفتاح خاص لتوليد فهرس فريد لضمان التنوع.
 * @param project_id - معرف المشروع الحالي.
 * @param description - وصف تفصيلي لمساعدة الذكاء الاصطناعي في اختيار الصورة.
 * @param need_large_image - هل نحتاج لصورة عالية الدقة؟
 */
async function get_image_url(
    keywords: string, 
    orientation: string = "landscape", 
    propKey: string = "default", 
    project_id: string = "", 
    description: string = "", 
    need_large_image: boolean = false
): Promise<string> {
    let url = "null";

    try {
        // 1. إذا كان المدخل رابطاً بالفعل أو Base64، نعيده مباشرة
        if (keywords.startsWith("data:") || keywords.startsWith("http")) {
            return keywords;
        }

        // 2. توليد مؤشر فريد (Index) بناءً على قيمة propKey لضمان اختيار صورة مختلفة لنفس الكلمات
        const uniqueIndex = Array.from(propKey).reduce(
            (acc, char) => (acc + char.charCodeAt(0)) % 10, 
            0
        );

        // 3. الطلب من محرك الصور الخاص بالمشروع
        const response = await fetch("https://project.autocoder.cc/api/project_pz/getimage", {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('full_token') || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: keywords,
                orientation: orientation,
                index: uniqueIndex,
                project_id: project_id,
                description: description,
                need_large_image: need_large_image
            })
        });

        if (response.ok) {
            const datas = await response.json();
            url = datas["url"] || "null";
        } else {
            console.warn(`Image API status: ${response.status} for query: ${keywords}`);
        }
    } catch (error) {
        console.error("Error fetching image URL:", error);
    }

    // يمكن هنا إرجاع رابط لصورة افتراضية (Placeholder) بدلاً من "null"
    return url !== "null" ? url : "https://via.placeholder.com/800x600?text=No+Image+Found";
}

export default get_image_url;