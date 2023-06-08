/*
    Copyright 2023 Thomas Bonk <thomas@meandmymac.de>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { ReactNode, useEffect, useState } from 'react';

interface ResizableProps {
    children: ReactNode;
}

export function Resizeable({ children }: ResizableProps) {
    const [resized, setResized] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setResized(resized + 1);
        };

        window.addEventListener("resize", handleResize);

        /*return () => {
            window.removeEventListener("resize", handleResize);
        };*/
    }, [resized]);

    return <>{children}</>
}
