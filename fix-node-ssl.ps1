# Fix Node.js SSL GCM Cipher Issue
# Try these solutions one at a time

Write-Output "حل مشكلة SSL في Node.js"
Write-Output "========================="
Write-Output ""

# Solution 1: Try using OpenSSL legacy provider
Write-Output "الحل 1: استخدام NODE_OPTIONS مع --openssl-legacy-provider"
Write-Output "نفّذ الأمر التالي قبل npm install:"
Write-Output '  $env:NODE_OPTIONS="--openssl-legacy-provider"'
Write-Output "  npm install --legacy-peer-deps"
Write-Output ""

# Solution 2: Reinstall Node.js using nvm with HTTP download
Write-Output "الحل 2: إعادة تثبيت Node.js عن طريق nvm"
Write-Output "قم بتنزيل Node.js من: https://nodejs.org/dist/ واستخرجه يدوياً"
Write-Output "أو استخدم: curl.exe -L -o node.zip http://nodejs.org/dist/v22.14.0/node-v22.14.0-win-x64.zip"
Write-Output ""

# Solution 3: Use yarn with HTTP registry
Write-Output "الحل 3: استخدام yarn مع HTTP registry"
Write-Output "  yarn config set registry http://registry.npmjs.org"
Write-Output "  yarn install --ignore-optional --network-timeout 120000"
Write-Output ""

# Solution 4: Disable SSL verification (temporary)
Write-Output "الحل 4: تعطيل التحقق من SSL مؤقتاً"
Write-Output "  npm config set strict-ssl false"
Write-Output "  npm install --legacy-peer-deps"
Write-Output ""

# Solution 5: Use a VPN or change network
Write-Output "إذا استمرت المشكلة، جرب:"
Write-Output "1. استخدام VPN"
Write-Output "2. تغيير الشبكة (تجربة اتصال مختلف)"
Write-Output "3. تعطيل antivirus/firewall مؤقتاً"
Write-Output ""

Write-Output "بعد تثبيت الحزم، شغّل:"
Write-Output "  npx prisma generate"
Write-Output "  npm run dev"
