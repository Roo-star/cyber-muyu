import sys

# 從 stdin 或直接讀 git checkout 的乾淨檔案
with open('index.html', 'rb') as f:
    raw = f.read()

# 強制 LF
html = raw.replace(b'\r\n', b'\n').replace(b'\r', b'\n').decode('utf-8')
print('Source lines:', html.count('\n'), 'CRLF in source:', raw.count(b'\r\n'))

# 改動1：加橋接
old1 = b'let clicks=0,merit=0,selPhrase=null,selColor=null,inputOn=false;'
new1 = old1 + b'\nwindow._muyu={get p(){return selPhrase},set p(v){selPhrase=v},get c(){return selColor},set c(v){selColor=v}};'
assert old1 in raw, 'old1 not found'

# 改動2：加 script tag
old2 = b'</body>\n</html>'
old2b = b'</body>\r\n</html>'
new2 = b'<script src="custom-chants.js"></script>\n</body>\n</html>'

out = raw.replace(b'\r\n', b'\n')  # 強制 LF
out = out.replace(old1, new1, 1)
if old2 in out:
    out = out.replace(old2, new2, 1)
else:
    print('WARNING: old2 not found, trying CRLF variant')

print('Result lines:', out.count(b'\n'), 'CRLF in result:', out.count(b'\r\n'))

with open('cyber-muyu.html', 'wb') as f:
    f.write(out)
with open('index.html', 'wb') as f:
    f.write(out)
print('SUCCESS')
