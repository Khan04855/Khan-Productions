# Khan Productions — pehle yeh parho

Yeh updated WEBSITE hai. Compiler ab is website se remove hai; us ka alag ZIP hai.

## Windows par website run karo

1. ZIP ko **Extract All** karo.
2. Extracted `Khan-Productions` folder kholo. Isi folder mein `package.json` hona chahiye.
3. File Explorer ke address bar mein `cmd` likho aur Enter dabao. Terminal isi folder mein khulega.
4. Node 24 LTS recommended hai. Agar Node 25 installed hai to bhi is project ki minimum requirement se upar hai.
5. Ek ek command chalao:

```bat
npm ci
copy .env.example .env
npm run admin:setup
```

Admin username aur apna password choose karo. Password kam az kam 12 characters ho. Password type karte waqt screen par nazar nahi aayega; yeh normal hai.

Ab isi terminal mein:

```bat
npm run api
```

Is terminal ko open rakho. Usi project folder mein doosra CMD kholo aur chalao:

```bat
npm run dev
```

Website: **http://localhost:8080/**

Admin portal: **http://localhost:8080/admin**

## Admin mein kya karna hai?

- Apne banaye hue username/password se sign in karo.
- Products, Books ya Music choose karo.
- Add ya Edit se details, image/cover, category/genre aur links set karo.
- PNG, JPEG ya WebP cover/product image upload kar sakte ho (5 MB tak).
- Published check karo aur Save item dabao; unchecked item draft rehta hai.
- Music/PDF file ka public URL do, ya supplied `public/music` / `public/books` assets ka `/music/...` / `/books/...` path do.
- Naye music ke liye cover na do to track ke title aur artist ke saath automatic artwork nazar aayega.

Data `data` folder mein save hota hai. Is folder ko delete na karo; backup rakho. Visitor ko browse ya tools use karne ke liye login ki zaroorat nahi.

## GitHub Pages aur assistant

GitHub Pages par frontend chalega. Live admin updates aur assistant ke liye Node backend hosting aur us ka URL configure karna zaroori hai. Sirf ZIP push karne se assistant API key ya backend automatically create nahi hoga.

Assistant ki key/model sirf backend `.env` mein set karna hai. Detailed local/hosting/GitHub instructions `README.md` mein hain. Live provider keys is ZIP mein shamil nahi hain.

Purane project ko overwrite karne se pehle us ka backup rakho. Yeh ZIP alag folder mein test karna asaan hai.
