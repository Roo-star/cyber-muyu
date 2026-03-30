import struct, math

with open(r'E:\cyber-muyu\muyu.stl', 'rb') as f:
    f.read(80)
    num_tri = struct.unpack('<I', f.read(4))[0]
    min_x=min_y=min_z=1e9
    max_x=max_y=max_z=-1e9
    # sample normals to understand orientation
    nx_avg=ny_avg=nz_avg=0
    count=0
    for i in range(num_tri):
        nx,ny,nz=struct.unpack('<3f',f.read(12))
        verts=[struct.unpack('<3f',f.read(12)) for _ in range(3)]
        f.read(2)
        for v in verts:
            min_x=min(min_x,v[0]);max_x=max(max_x,v[0])
            min_y=min(min_y,v[1]);max_y=max(max_y,v[1])
            min_z=min(min_z,v[2]);max_z=max(max_z,v[2])

print(f'X: {min_x:.2f} to {max_x:.2f}  span={max_x-min_x:.2f}')
print(f'Y: {min_y:.2f} to {max_y:.2f}  span={max_y-min_y:.2f}')
print(f'Z: {min_z:.2f} to {max_z:.2f}  span={max_z-min_z:.2f}')
cx=(min_x+max_x)/2; cy=(min_y+max_y)/2; cz=(min_z+max_z)/2
print(f'Center: ({cx:.2f}, {cy:.2f}, {cz:.2f})')
print()
print('Axis interpretation:')
print(f'  X span {max_x-min_x:.1f}: likely width (left-right)')
print(f'  Y span {max_y-min_y:.1f}: likely depth (front-back / mouth direction)')
print(f'  Z span {max_z-min_z:.1f}: likely height (up-down)')
print()
print('Min Y face = front of muyu (mouth side)?')
print(f'  Y_min={min_y:.2f}, Y_max={max_y:.2f}')
print(f'  Center Y={cy:.2f}')
print()

# Find vertices with extreme Y (near Y_min = likely mouth side)
with open(r'E:\cyber-muyu\muyu.stl', 'rb') as f:
    f.read(80)
    num_tri = struct.unpack('<I', f.read(4))[0]
    mouth_tris=[]
    for i in range(num_tri):
        nx,ny,nz=struct.unpack('<3f',f.read(12))
        verts=[struct.unpack('<3f',f.read(12)) for _ in range(3)]
        f.read(2)
        avg_y=sum(v[1] for v in verts)/3
        avg_z=sum(v[2] for v in verts)/3
        if avg_y < min_y+2:  # near Y minimum
            mouth_tris.append((avg_y, avg_z, nx,ny,nz))

print(f'Triangles near Y_min (mouth side): {len(mouth_tris)}')
if mouth_tris:
    z_vals=[t[1] for t in mouth_tris]
    print(f'  Z range at Y_min: {min(z_vals):.1f} to {max(z_vals):.1f}')
    print(f'  -> This is the mouth, at NEGATIVE Y side')
    print(f'  -> To show mouth on right, map -Y -> screen X (positive)')
