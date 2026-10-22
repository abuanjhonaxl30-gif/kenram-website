# Kenram Car Rental Website

Website ng Kenram Car Rental sa Isulan, Sultan Kudarat. Gawa sa **Next.js** (TypeScript, Tailwind) at **Firebase Firestore**.

## Getting Started

1. I-clone ang project:

   ```bash
   git clone https://github.com/abuanjhonaxl30-gif/kenram-website.git
   cd kenram-website
   ```

2. I-install ang packages:

   ```bash
   npm install
   ```

3. Gumawa ng `.env.local` sa root ng project (katabi ng `package.json`). Hingin sa may-ari ng project ang mga value, **huwag i-commit ang file na ito**:

   ```env
   FIREBASE_PROJECT_ID=
   FIREBASE_CLIENT_EMAIL=
   FIREBASE_PRIVATE_KEY=
   ```

   May iba pang variables na maaaring kailanganin (halimbawa para sa admin login). Itanong sa may-ari ng project.

4. I-run ang development server:

   ```bash
   npm run dev
   ```

5. Buksan ang <http://localhost:3000>.

## Project Structure

| Folder | Laman |
| --- | --- |
| `src/app` | Mga page at route ng site |
| `src/components` | Mga UI component (Navbar, Hero, Fleet, FleetCard, atbp.) |
| `src/lib` | Server code: Firebase, availability, inquiries, admin |
| `public` | Mga larawan at static files |

## Git Guide para sa Team

### Mga Patakaran

- **Huwag mag-push direkta sa `main`.** Ang `main` ang bersyon na live sa site.
- Gumawa ng sariling **branch** para sa bawat gawain.
- **Huwag i-commit ang `.env.local`** o anumang password at private key. Kapag nakalusot ito sa GitHub, ituring nang nakompromiso ang key at ipa-palitan agad.
- Kung hindi sigurado, magtanong muna bago mag-push.

### Isang Beses Lang: Unang Setup

```bash
git clone https://github.com/abuanjhonaxl30-gif/kenram-website.git
cd kenram-website
npm install
```

### Araw-araw na Workflow

**1. Kunin ang pinakabagong `main` bago magsimula**

```bash
git checkout main
git pull
```

**2. Gumawa ng bagong branch para sa gagawin mo**

```bash
git checkout -b feature/pangalan-ng-gawain
```

Mga halimbawa ng pangalan: `feature/navbar-logo`, `feature/email-inquiry`, `fix/calendar-dates`.

**3. Mag-code, tapos tingnan ang mga nabago**

```bash
git status
```

**4. I-add at i-commit**

```bash
git add .
git commit -m "Maikling paliwanag ng ginawa"
```

**5. I-push ang branch mo sa GitHub**

```bash
git push -u origin feature/pangalan-ng-gawain
```

Sa susunod na push sa parehong branch, `git push` na lang.

**6. Gumawa ng Pull Request**

Sa GitHub, lalabas ang berdeng button na **Compare & pull request**. I-click ito, lagyan ng maikling paliwanag, at hintayin ang review bago i-merge sa `main`.

**7. Pagkatapos ma-merge, bumalik sa `main`**

```bash
git checkout main
git pull
```

### Cheat Sheet

| Command | Ginagawa |
| --- | --- |
| `git status` | Tingnan kung ano ang nabago at nasa anong branch ka |
| `git pull` | Kunin ang pinakabagong gawa ng iba mula sa GitHub |
| `git add .` | Ihanda ang lahat ng nabago para sa commit |
| `git add <file>` | Ihanda ang isang file lang |
| `git commit -m "mensahe"` | I-save ang mga nabago bilang isang commit |
| `git push` | I-upload ang mga commit sa GitHub |
| `git push -u origin <branch>` | Unang push ng bagong branch |
| `git branch` | Listahan ng mga branch mo |
| `git checkout <branch>` | Lumipat ng branch |
| `git checkout -b <branch>` | Gumawa at lumipat sa bagong branch |
| `git log --oneline` | Tingnan ang kasaysayan ng commits |
| `git diff` | Tingnan ang eksaktong nabago sa mga file |
| `git stash` | Pansamantalang itabi ang mga hindi pa na-commit |
| `git stash pop` | Ibalik ang itinabing mga pagbabago |

### Kapag May Problema

**"Your branch is behind" o hindi makapag-push**

```bash
git pull
git push
```

**Merge conflict pagkatapos mag-pull**

Bubuksan ng VS Code ang file na may conflict at may mga marka na `<<<<<<<`, `=======` at `>>>>>>>`. Piliin kung aling bersyon ang itatago (**Accept Current**, **Accept Incoming**, o **Accept Both**), tapos:

```bash
git add .
git commit -m "Resolve merge conflict"
```

Kung nalilito, huwag mag-force. Magtanong muna sa team.

**Nagkamali ng commit message (hindi pa na-push)**

```bash
git commit --amend -m "Tamang mensahe"
```

**Gusto mong i-undo ang mga nabago sa isang file (hindi pa na-commit)**

```bash
git checkout -- <pangalan-ng-file>
```

Mag-ingat, mawawala ang mga nabago mo sa file na iyon.

**Napunta sa maling branch**

```bash
git status
git checkout <tamang-branch>
```

Kung may mga nabago ka na, `git stash` muna bago lumipat, tapos `git stash pop` sa tamang branch.

## Deploy

Naka-deploy ang site sa Vercel. Kapag na-merge ang pull request sa `main`, awtomatikong magbi-build at magde-deploy ito.