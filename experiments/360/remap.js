var map = [];
var map_initialized = false;

function remap(imgDataIn) {
    // Initialize.
    function init_config(imgDataIn, radius_minimize, row_offset, col_offset) {
        let fisheye_center_row = Math.floor(imgDataIn.height/2) + row_offset;
        let fisheye_center_col = Math.floor(imgDataIn.width/2) + col_offset;
        let fisheye_img_radius = Math.floor(Math.min(imgDataIn.height, imgDataIn.width)/2) - radius_minimize; // Math.floor(5/2) = 2, Math.floor(4/2) = 2.

        const config = {
            fisheye_center_row: fisheye_center_row,
            fisheye_center_col: fisheye_center_col,
            fisheye_img_radius: fisheye_img_radius,
        };

        return config;
    }

    function get_fisheye_coord(row_e, col_e, output_width, output_height, input_width, input_height, fisheye_center_row, fisheye_center_col, fisheye_img_radius) {       
        let fov = Math.PI;
        let half_fov = fov/2;
        let lat = Math.PI * ((row_e/output_width) - 0.5);
        let lon = Math.PI * ((col_e/output_height) - 0.5);
        
        let sph_x = Math.cos(lat) * Math.sin(lon);
        let sph_y = Math.cos(lat) * Math.cos(lon);
        let sph_z = Math.sin(lat);

        let theta = Math.atan2(sph_z, sph_x);
        let phi = Math.atan2(Math.sqrt(sph_z*sph_z + sph_x*sph_x), sph_y);

        let r = fisheye_img_radius * (phi / half_fov);

        let fish_row = Math.floor( (fisheye_center_row) + r * Math.sin(theta) );
        let fish_col = Math.floor( (fisheye_center_col) + r * Math.cos(theta) );

        // Ensure within bounds.
        fish_row = Math.min(Math.max(fish_row, 0), input_height-1);
        fish_col = Math.min(Math.max(fish_col, 0), input_width-1);

        return 4*(fish_row*input_width + fish_col);
    }

    // Settings.
    let radius_minimize = 0;
    let row_offset = 0; // Positive is downwards.
    let col_offset = 0; // Positive is rightwards.

    let { fisheye_center_row, fisheye_center_col,  fisheye_img_radius } = init_config(imgDataIn, radius_minimize, row_offset, col_offset);
    let output_width = 2*fisheye_img_radius;  // Apply padding later.
    let output_height = 2*fisheye_img_radius;
    // let padding = Array(fisheye_img_radius*4).fill(255);

    // Initialize map if not already initialized.
    if (!map_initialized) {
        for (let row = 0; row < output_height; ++row) {
            for (let col = 0; col < output_width; ++col) {
                let mapped_input_i = get_fisheye_coord(row, col, output_width, output_height, imgDataIn.width, imgDataIn.height, fisheye_center_row, fisheye_center_col, fisheye_img_radius);
                map.push(mapped_input_i);
            }
        }
        map_initialized = true;
        console.log("Map initialized.");
    }
    
    let rows = new Uint8ClampedArray((output_width)*output_height*4);

    let map_idx = 0;
    // console.log(output_height*output_width*4);
    for (let row = 0; row < output_height; ++row) {
        // let curr_row_base_i = row*output_width*4;
        let curr_cell_base_i = 4*(row*output_width); // curr_row_base_i;

        for (let col = 0; col < output_width; ++col) {
            let mapped_input_i = map[map_idx];

            rows[curr_cell_base_i] = imgDataIn.data[mapped_input_i];
            rows[curr_cell_base_i + 1] = imgDataIn.data[mapped_input_i + 1];
            rows[curr_cell_base_i + 2] = imgDataIn.data[mapped_input_i + 2];
            rows[curr_cell_base_i + 3] = imgDataIn.data[mapped_input_i + 3];

            map_idx += 1;
            curr_cell_base_i += 4;
        }
    }
    console.log("Img initialized.");
    return new ImageData( rows, output_width, output_height);
}