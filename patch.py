with open('cyber-muyu-betav1-LOCKED.html', 'rb') as f:
    html = f.read().decode('utf-8')

# 確認純 LF
crlf = html.count('\r\n')
print('Source CRLF count:', crlf)
html = html.replace('\r\n', '\n')  # 強制 LF

# 改動1：加橋接物件（一行）
old1 = 'let clicks=0,merit=0,selPhrase=null,selColor=null,inputOn=false;'
new1 = old1 + '\nwindow._muyu={get p(){return selPhrase},set p(v){selPhrase=v},get c(){return selColor},set c(v){selColor=v}};'
assert old1 in html, 'ERROR: old1 not found'
html = html.replace(old1, new1, 1)

# 改動2：加 script 標籤
old2 = '</body>\n</html>'
new2 = '<script src="custom-chants.js"></script>\n</body>\n</html>'
assert old2 in html, 'ERROR: old2 not found'
html = html.replace(old2, new2, 1)

# 寫出純 LF
with open('cyber-muyu.html', 'wb') as f:
    f.write(html.encode('utf-8'))
with open('index.html', 'wb') as f:
    f.write(html.encode('utf-8'))

print('Done. Lines:', html.count('\n'), '| CRLF:', html.count('\r\n'))
