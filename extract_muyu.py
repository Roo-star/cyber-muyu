import struct, random, math

with open(r'E:\cyber-muyu\muyu.stl', 'rb') as f:
    f.read(80)
    num_tri = struct.unpack('<I', f.read(4))[0]
    triangles = []
    for i in range(num_tri):
        nx, ny, nz = struct.unpack('<3f', f.read(12))
        v1 = struct.unpack('<3f', f.read(12))
        v2 = struct.unpack('<3f', f.read(12))
        v3 = struct.unpack('<3f', f.read(12))
        f.read(2)
        triangles.append((v1, v2, v3, (nx, ny, nz)))

all_verts = [v for tri in triangles for v in tri[:3]]
min_x=min(v[0] for v in all_verts); max_x=max(v[0] for v in all_verts)
min_y=min(v[1] for v in all_verts); max_y=max(v[1] for v in all_verts)
min_z=min(v[2] for v in all_verts); max_z=max(v[2] for v in all_verts)
cx=(min_x+max_x)/2; cy=(min_y+max_y)/2; cz=(min_z+max_z)/2
span=max(max_x-min_x, max_y-min_y, max_z-min_z)
scale=2.0/span

def tv(v):
    return (round(-(v[1]-cy)*scale,4), round(-(v[2]-cz)*scale,4), round((v[0]-cx)*scale,4))
def tn(n):
    nx2=-n[1]; ny2=-n[2]; nz2=n[0]
    l=math.sqrt(nx2*nx2+ny2*ny2+nz2*nz2) or 1
    return (round(nx2/l,4), round(ny2/l,4), round(nz2/l,4))

areas=[]
for v1,v2,v3,n in triangles:
    e1=(v2[0]-v1[0],v2[1]-v1[1],v2[2]-v1[2])
    e2=(v3[0]-v1[0],v3[1]-v1[1],v3[2]-v1[2])
    cr=(e1[1]*e2[2]-e1[2]*e2[1], e1[2]*e2[0]-e1[0]*e2[2], e1[0]*e2[1]-e1[1]*e2[0])
    areas.append(0.5*math.sqrt(cr[0]**2+cr[1]**2+cr[2]**2))
total=sum(areas); cdf=[]; c=0
for a in areas: c+=a; cdf.append(c/total)

def sample_surface():
    r=random.random(); lo,hi=0,len(cdf)-1
    while lo<hi:
        mid=(lo+hi)//2
        if cdf[mid]<r: lo=mid+1
        else: hi=mid
    v1,v2,v3,normal=triangles[lo]
    r1=random.random(); r2=random.random()
    if r1+r2>1: r1=1-r1; r2=1-r2
    r3=1-r1-r2
    raw=tuple(v1[i]*r1+v2[i]*r2+v3[i]*r3 for i in range(3))
    return tv(raw), tn(normal)

# === Surface points (8000) ===
print("Sampling 8000 surface points...")
surface=[]
for _ in range(8000):
    p,n=sample_surface()
    surface.append((*p,*n))
print(f"Surface: {len(surface)}")

# === Interior points: shrink surface points toward center ===
# Each interior point = surface point scaled down by random factor 0.0~0.95
# This fills the interior with the same shape as the surface
print("Generating 2000 interior points...")
interior=[]
for _ in range(2000):
    p,n=sample_surface()
    s=random.uniform(0.0, 0.92)  # random depth into center
    interior.append((round(p[0]*s,4), round(p[1]*s,4), round(p[2]*s,4)))
print(f"Interior: {len(interior)}")

with open(r'E:\cyber-muyu\muyu_points.js','w') as out:
    out.write("const MUYU_POINTS=[\n")
    for p in surface:
        out.write(f"[{','.join(str(x) for x in p)}],\n")
    out.write("];\n\n")
    out.write("const MUYU_INTERIOR=[\n")
    for p in interior:
        out.write(f"[{p[0]},{p[1]},{p[2]}],\n")
    out.write("];\n")

print("Done!")
