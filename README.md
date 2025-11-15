# 🎬 Showmint — Distributed Video Streaming Platform

Showmint is a cloud-native, microservices-based **YouTube-like video streaming system** built with **Next.js**, **Node.js**, **Kafka**, **FFmpeg**, **AWS S3**, **CloudFront**, and **PostgreSQL**.

It supports **chunk file upload → distributed transcoding → HLS streaming → adaptive video playback**, designed for production-scale distributed systems.

---

# 🚀 Features

### 🔼 Upload
- Chunk-based upload (sequential or parallel)
- Multipart upload to AWS S3
- Fault-tolerant, resumable uploads
- Metadata stored via Prisma in PostgreSQL

### 🔄 Processing
- Kafka distributed event pipeline
- Independent transcoder microservice
- FFmpeg-based HLS conversion (multi-bitrate)

### 🎥 Playback
- HLS streaming with `hls.js`
- CloudFront CDN optimized delivery
- Adaptive bitrate streaming (180p/480p/720p)

### 🔐 Authentication
- NextAuth Google OAuth 2.0
- Protected upload route

### 🧩 Microservices
- Upload Service  
- Transcoder Service  
- Watch Service  
- Frontend Client (Next.js)

---

# 🖼 Demo Screenshots (assets/ folder)

These images are stored in `assets/` and used for showcasing the system.

### Home Page  
![Home Page](`assets/Screenshot 2025-11-16 003018.png`)

### Login Page  
![Login Page](`assets/Screenshot 2025-11-16 003029.png`)

### Loged In Page  
![Loged In Page](`assets/Screenshot 2025-11-16 003058.png`)

### HLS Player  
![HLS Player](`assets/Screenshot 2025-11-16 003121.png`)

### Upload Form  
![Upload Form](`assets/Screenshot 2025-11-16 003143.png`)

### Search  
![Search](`assets/Screenshot 2025-11-16 003143.png`)

---

# 🏗 Architecture

```
CLIENT (Next.js)
      │ UPLOAD (Chunks)
      ▼
UPLOAD SERVICE ───► Kafka Topic "transcode"
      │
      ▼
TRANSCODER SERVICE
      │ Downloads MP4 → Converts to HLS → Uploads to S3/hls
      ▼
AWS S3  → CloudFront CDN
      │
WATCH SERVICE
      ▼
HLS Player (hls.js)
```

---

# 📁 Folder Structure

```
Showmint/
 ├── client/                # Next.js App
 ├── upload_service/        # Chunk upload + DB insert + Kafka produce
 ├── transcoder_service/    # Kafka consumer + FFmpeg → HLS → S3
 ├── watch_service/         # Signed URL + fetch video list
 └── README.md
```

---

# ⚙️ Setup Instructions

## 1. Clone the repository

```bash
git clone https://github.com/agamswami/Showmint
cd Showmint
```

---

# 🔑 Environment Variables

Create the following `.env` files.

---

## 📌 upload_service/.env

```
PORT=8080
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
AWS_BUCKET=showmint-2
AWS_REGION=ap-south-1

DATABASE_URL=postgres://user:pass@host:port/db

KAFKA_BROKER=host:port
KAFKA_USERNAME=avnadmin
KAFKA_PASS=xxxx
```

---

## 📌 transcoder_service/.env

```
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
AWS_BUCKET=showmint-2
AWS_REGION=ap-south-1
```

---

## 📌 watch_service/.env

```
PORT=8082
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
AWS_BUCKET=showmint-2
AWS_REGION=ap-south-1
```

---

## 📌 client/.env.local

```
NEXT_PUBLIC_UPLOAD_URL=http://localhost:8080
NEXT_PUBLIC_CDF_URL=https://<cloudfront-id>.cloudfront.net
NEXT_PUBLIC_LAMBDA=https://<lambda-url>

NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
```

---

# 🧱 Install Dependencies

### Upload Service
```bash
cd upload_service
npm install
```

### Transcoder Service
```bash
cd transcoder_service
npm install
```

### Watch Service
```bash
cd watch_service
npm install
```

### Client
```bash
cd client
npm install
```

---

# 🗄 Database Setup (Prisma)

Inside `upload_service`:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### VideoData Schema

```prisma
model VideoData {
  id          Int     @id @default(autoincrement())
  title       String
  description String?
  author      String
  url         String
}
```

---

# 📨 Kafka Setup (Aiven)

1. Create Kafka service  
2. Enable SASL authentication  
3. Download CA certificate → save as `ca.pem`  
4. Create topic:  
   ```
   transcode
   ```
5. Add credentials to `.env`

---

# ▶️ Running All Services

---

## 1️⃣ Upload Service

```bash
cd upload_service
npm run start
```

Runs on:  
**http://localhost:8080**

---

## 2️⃣ Transcoder Service

```bash
cd transcoder_service
npm run start
```

Transcoder does:

- Download MP4 from S3  
- Convert to HLS (180p/480p/720p)  
- Upload `.m3u8` + `.ts` to S3/hls  

---

## 3️⃣ Watch Service

```bash
cd watch_service
npm run start
```

Endpoints:

- `/watch?key=filename` → signed URL
- `/watch/home` → list videos

Runs on:  
**http://localhost:8082**

---

## 4️⃣ Next.js Client

```bash
cd client
npm run dev
```

Runs on:  
**http://localhost:3000**

Includes:

- Google authentication  
- Upload page  
- Home page with video grid  
- HLS player  

---

# 🔁 End-to-End Flow

### 1. User Uploads Video
Next.js → Upload Service  
→ Chunks uploaded to S3 → metadata stored in DB → pushed to Kafka

### 2. Transcoder Service
Consumes Kafka → downloads MP4 → converts to HLS → uploads to S3

### 3. Watch Service
Returns signed playback URL + video list

### 4. Client
Streams HLS instantly via `hls.js`

---

# 🎞 HLS Streaming Example

```jsx
const hls = new Hls();
hls.attachMedia(videoRef.current);
hls.loadSource(src);
```

Resolutions produced:
- 320x180 (500k)
- 854x480 (1Mbps)
- 1280x720 (2.5Mbps)

---

# 📡 Deployment Suggestions

| Component | Recommended |
|----------|-------------|
| Client | Vercel |
| Upload Service | EC2 / Docker |
| Watch Service | EC2 / Docker |
| Transcoder | EC2 (with ffmpeg-static) |
| Kafka | Aiven |
| Postgres | Aiven |
| CDN | CloudFront |

---

# 📈 Future Enhancements
- Search using OpenSearch  
- Video thumbnails  
- Likes, comments, subscriptions  
- Categories + channels  
- Notifications  
- DASH streaming support  

---

# 👨‍💻 Author

**Agam Swami**  
Distributed Systems & Full Stack Developer  
IIIT Gwalior  
GitHub: https://github.com/agamswami

