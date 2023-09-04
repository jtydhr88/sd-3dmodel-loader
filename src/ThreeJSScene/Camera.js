export function setCameraFar(_camera, _secondCamera, far) {
    _camera.far = far;
    _camera.updateProjectionMatrix();
    _secondCamera.far = far;
    _secondCamera.updateProjectionMatrix();
}

export function setCameraNear(_camera, _secondCamera, near) {
    _camera.near = near;
    _camera.updateProjectionMatrix();
    _secondCamera.near = near;
    _secondCamera.updateProjectionMatrix();
}

export function setCameraFOV(_camera, _secondCamera, fov) {
    _camera.fov = fov;
    _camera.updateProjectionMatrix();
    _secondCamera.fov = fov;
    _secondCamera.updateProjectionMatrix();
}