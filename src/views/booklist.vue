<template>
    <h1>booklist</h1>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "booklist",
        mounted() {
            axios.get({
                url:'/novelBook/book/list NovleBookController.java '
            }).then(res=>{
                // eslint-disable-next-line no-console
                console.log(res);
            })

        }
    }
</script>

<style scoped>

</style>